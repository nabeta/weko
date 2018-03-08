# -*- coding: utf-8 -*-
#
# This file is part of WEKO3.
# Copyright (C) 2017 National Institute of Informatics.
#
# WEKO3 is free software; you can redistribute it
# and/or modify it under the terms of the GNU General Public License as
# published by the Free Software Foundation; either version 2 of the
# License, or (at your option) any later version.
#
# WEKO3 is distributed in the hope that it will be
# useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with WEKO3; if not, write to the
# Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston,
# MA 02111-1307, USA.

"""Blueprint for weko-items-ui."""

import os

from flask import Blueprint, current_app, flash, json, jsonify, redirect, \
    render_template, request, url_for, g
from flask_babelex import gettext as _
from flask_login import login_required, current_user
import redis
from simplekv.memory.redisstore import RedisStore
from weko_records.api import ItemTypes, WekoRecord
from .permissions import item_permission
from invenio_records_ui.signals import record_viewed

blueprint = Blueprint(
    'weko_items_ui',
    __name__,
    url_prefix='/items',
    template_folder='templates',
    static_folder='static',
)


@blueprint.route("/", methods=['GET'])
@blueprint.route("/<int:item_type_id>", methods=['GET'])
@login_required
@item_permission.require(http_exception=403)
def index(item_type_id=0):
    """Renders an item register view.

    :param item_type_id: Item type ID. (Default: 0)
    :return: The rendered template.
    """
    current_app.logger.debug(item_type_id)
    lists = ItemTypes.get_latest()
    if lists is None or len(lists) == 0:
        return render_template(
            current_app.config['WEKO_ITEMS_UI_ERROR_TEMPLATE']
        )
    item_type = ItemTypes.get_by_id(item_type_id)
    if item_type is None:
        return redirect(
            url_for('.index', item_type_id=lists[0].item_type[0].id))
    json_schema = '/items/jsonschema/{}'.format(item_type_id)
    schema_form = '/items/schemaform/{}'.format(item_type_id)
    need_file = False
    if 'filemeta' in json.dumps(item_type.schema):
        need_file = True
    return render_template(
        current_app.config['WEKO_ITEMS_UI_FORM_TEMPLATE'],
        need_file=need_file,
        record={},
        jsonschema=json_schema,
        schemaform=schema_form,
        lists=lists,
        id=item_type_id
    )


# @blueprint.route("/edit/<int:pid>", methods=['GET'])
# @login_required
# @item_permission.require(http_exception=403)
# def edit(pid=0):
#     """Renders an item edit view.
#
#     :param pid: PID value. (Default: 0)
#     :return: The rendered template.
#     """
#     current_app.logger.debug(pid)
#     return "OK"


@blueprint.route('/jsonschema/<int:item_type_id>', methods=['GET'])
@login_required
@item_permission.require(http_exception=403)
def get_json_schema(item_type_id=0):
    """Get json schema.

    :param item_type_id: Item type ID. (Default: 0)
    :return: The json object.
    """
    current_app.logger.debug(item_type_id)
    result = None
    if item_type_id > 0:
        result = ItemTypes.get_record(item_type_id)
    current_app.logger.debug(result)
    if result is None:
        return '{}'
    return jsonify(result)


@blueprint.route('/schemaform/<int:item_type_id>', methods=['GET'])
@login_required
@item_permission.require(http_exception=403)
def get_schema_form(item_type_id=0):
    """Get schema form.

    :param item_type_id: Item type ID. (Default: 0)
    :return: The json object.
    """
    current_app.logger.debug(item_type_id)
    result = None
    if item_type_id > 0:
        result = ItemTypes.get_by_id(item_type_id)
    if result is None:
        return '["*"]'
    current_app.logger.debug(jsonify(result.form))
    return jsonify(result.form)


@blueprint.route("/index/<int:pid_value>", methods=['GET', 'PUT', 'POST'])
@login_required
@item_permission.require(http_exception=403)
def items_index(pid_value=0):
    if pid_value == 0:
        return redirect(url_for('.index'))
    if request.method == 'GET':
        return render_template(
            current_app.config['WEKO_ITEMS_UI_INDEX_TEMPLATE'],
            pid_value=pid_value)
    if request.headers['Content-Type'] != 'application/json':
        flash(_('invalide request'), 'error')
        return render_template(
            current_app.config['WEKO_ITEMS_UI_INDEX_TEMPLATE'])

    data = request.get_json()
    sessionstore = RedisStore(redis.StrictRedis.from_url(
        'redis://{host}:{port}/1'.format(
            host=os.getenv('INVENIO_REDIS_HOST', 'localhost'),
            port=os.getenv('INVENIO_REDIS_PORT', '6379'))))
    if request.method == 'PUT':
        """ update index of item info """
        item_str = sessionstore.get('item_index_{}'.format(pid_value))
        sessionstore.delete('item_index_{}'.format(pid_value))
        current_app.logger.debug(item_str)
        item = json.loads(item_str)
        item['index'] = data
        current_app.logger.debug(item)
    elif request.method == 'POST':
        """ update item data info """
        current_app.logger.debug(data)
        sessionstore.put('item_index_{}'.format(pid_value), json.dumps(data),
                         ttl_secs=300)
    return jsonify(data)


def default_view_method(pid, record, template=None):
    """Default view method.

    Sends ``record_viewed`` signal and renders template.
    """
    record_viewed.send(
        current_app._get_current_object(),
        pid=pid,
        record=record,
    )

    item_type_id = record.get('item_type_id')
    lists = ItemTypes.get_latest()
    if lists is None or len(lists) == 0:
        return render_template(
            current_app.config['WEKO_ITEMS_UI_ERROR_TEMPLATE']
        )
    item_type = ItemTypes.get_by_id(item_type_id)
    if item_type is None:
        return redirect(
            url_for('.index', item_type_id=lists[0].item_type[0].id))
    json_schema = '/items/jsonschema/{}'.format(item_type_id)
    schema_form = '/items/schemaform/{}'.format(item_type_id)
    need_file = False
    if 'filemeta' in json.dumps(item_type.schema):
        need_file = True
    return render_template(
        template,
        need_file=need_file,
        record=record.item_metadata,
        jsonschema=json_schema,
        schemaform=schema_form,
        lists=lists,
        id=item_type_id
        # pid=pid
    )
