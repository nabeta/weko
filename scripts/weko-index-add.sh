curl -X PUT \
  http://elasticsearch:9200/weko \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'postman-token: 345ae1e1-de4e-6bb6-3f9c-69569bddc686' \
  -d '{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0,
    "analysis": {
      "tokenizer": {
        "ja_tokenizer": {
          "type": "kuromoji_tokenizer",
          "mode": "search"
        },
        "ngram_tokenizer": {
          "type": "nGram",
          "min_gram": 2,
          "max_gram": 3,
          "token_chars": [
            "letter",
            "digit"
          ]
        }
      },
      "analyzer": {
        "ja_analyzer": {
          "tokenizer": "ja_tokenizer",
          "filter": [
            "kuromoji_baseform",
            "kuromoji_part_of_speech",
            "cjk_width",
            "stop",
            "kuromoji_stemmer",
            "lowercase"
          ]
        },
        "ngram_analyzer": {
          "type": "custom",
          "char_filter": [
            "html_strip"
          ],
          "tokenizer": "ngram_tokenizer",
          "filter": [
            "cjk_width",
            "lowercase"
          ]
        },
        "wk_analyzer": {
          "type": "custom",
          "char_filter": [
            "html_strip"
          ],
          "tokenizer": "standard",
          "filter": [
            "standard",
            "lowercase",
            "stop",
            "cjk_width"
          ]
        },
        "paths": {
          "tokenizer": "path_hierarchy"
        }
      }
    }
  },
  "mappings": {
    "item": {
      "_all": {
        "enabled": true
      },
      "properties": {
        "path": {
          "type": "string",
          "index": "not_analyzed",
          "fields": {
            "tree": {
              "type": "string",
              "analyzer": "paths"
            }
          }
        },
        "item_id": {
          "type": "string"
        },
        "control_number": {
          "type": "string"
        },
        "publish_date": {
          "type": "date",
          "format": "yyyy-MM-dd"
        },
        "create_date": {
          "type": "date",
          "format": "yyyy-MM-dd HH:mm:ss"
        },
        "review_date": {
          "type": "date",
          "format": "yyyy-MM-dd HH:mm:ss"
        },
        "update_date": {
          "type": "date",
          "format": "yyyy-MM-dd HH:mm:ss"
        },
        "BSH": {
          "type": "string",
          "copy_to": [
            "search_sh"
          ]
        },
        "DDC": {
          "type": "string",
          "copy_to": [
            "search_sh"
          ]
        },
        "NDLC": {
          "type": "string",
          "copy_to": [
            "search_sh"
          ]
        },
        "isbn": {
          "type": "string",
          "copy_to": [
            "search_id"
          ]
        },
        "issn": {
          "type": "string",
          "copy_to": [
            "search_id"
          ]
        },
        "LCC": {
          "type": "string",
          "copy_to": [
            "search_sh"
          ]
        },
        "LCSH": {
          "type": "string",
          "copy_to": [
            "search_sh"
          ]
        },
        "MeSH": {
          "type": "string",
          "copy_to": [
            "search_sh"
          ]
        },
        "NAID": {
          "type": "string",
          "copy_to": [
            "search_id"
          ]
        },
        "NCID": {
          "type": "string",
          "copy_to": [
            "search_id"
          ]
        },
        "NDC": {
          "type": "string",
          "copy_to": [
            "search_sh"
          ]
        },
        "NDLSH": {
          "type": "string",
          "copy_to": [
            "search_sh"
          ]
        },
        "NIIspatial": {
          "type": "string",
          "copy_to": [
            "search_spatial"
          ]
        },
        "NIIsubject": {
          "type": "string",
          "copy_to": [
            "search_sh"
          ]
        },
        "NIItemporal": {
          "type": "string",
          "copy_to": [
            "search_temporal"
          ]
        },
        "NIItype": {
          "type": "string"
        },
        "UDC": {
          "type": "string",
          "copy_to": [
            "search_sh"
          ]
        },
        "URI": {
          "type": "string",
          "copy_to": [
            "search_id"
          ]
        },
        "alternative": {
          "type": "string",
          "copy_to": [
            "search_title"
          ]
        },
        "contributor": {
          "type": "string",
          "copy_to": [
            "search_contributor"
          ]
        },
        "creator": {
          "type": "string",
          "copy_to": [
            "search_creator"
          ]
        },
        "date": {
          "type": "date",
          "format": "yyyy-MM-dd"
        },
        "dateofgranted": {
          "type": "date",
          "format": "yyyy-MM-dd"
        },
        "dateofissued": {
          "type": "date",
          "format": "yyyy-MM-dd"
        },
        "degreename": {
          "type": "string"
        },
        "description": {
          "type": "string",
          "analyzer": "ja_analyzer"
        },
        "doi": {
          "type": "string",
          "copy_to": [
            "search_id"
          ]
        },
        "format": {
          "type": "string"
        },
        "fullTextURL": {
          "type": "string",
          "copy_to": [
            "search_id"
          ]
        },
        "grantid": {
          "type": "string"
        },
        "grantor": {
          "type": "string"
        },
        "ichushi": {
          "type": "string",
          "copy_to": [
            "search_id"
          ]
        },
        "identifier": {
          "type": "string",
          "copy_to": [
            "search_id"
          ]
        },
        "type": {
          "type": "string"
        },
        "jtitle": {
          "type": "string",
          "analyzer": "ja_analyzer"
        },
        "language": {
          "type": "string"
        },
        "pmid": {
          "type": "string",
          "copy_to": [
            "search_id"
          ]
        },
        "publisher": {
          "type": "string",
          "copy_to": [
            "search_publisher"
          ]
        },
        "rights": {
          "type": "string"
        },
        "selfDOI": {
          "type": "string",
          "copy_to": [
            "search_id"
          ]
        },
        "spatial": {
          "type": "string",
          "copy_to": [
            "search_spatial"
          ]
        },
        "subject": {
          "type": "string",
          "analyzer": "ja_analyzer"
        },
        "temporal": {
          "type": "string",
          "copy_to": [
            "search_temporal"
          ]
        },
        "textversion": {
          "type": "string"
        },
        "title": {
          "type": "string",
          "copy_to": [
            "search_title"
          ]
        },
        "weko_creator_id": {
          "type": "string",
          "copy_to": [
            "search_creator",
            "search_publisher",
            "search_contributor"
          ]
        },
        "search_title": {
          "type": "string",
          "analyzer": "ja_analyzer"
        },
        "search_creator": {
          "type": "string"
        },
        "search_sh": {
          "type": "string"
        },
        "search_publisher": {
          "type": "string"
        },
        "search_contributor": {
          "type": "string"
        },
        "search_id": {
          "type": "string"
        },
        "search_spatial": {
          "type": "string"
        },
        "search_temporal": {
          "type": "string"
        }
      },
      "dynamic_templates": [
        {
          "string": {
            "match_mapping_type": "string",
            "mapping": {
              "type": "string",
              "index": "not_analyzed"
            }
          }
        }
      ]
    },
    "content": {
      "_all": {
        "enabled": true
      },
      "_parent": {
        "type": "item"
      },
      "properties": {
        "item_id": {
          "type": "string"
        },
        "file_id": {
          "type": "string"
        },
        "file_name": {
          "type": "string"
        },
        "display_name": {
          "type": "string"
        },
        "mime_type": {
          "type": "string"
        },
        "license_notation": {
          "type": "string"
        },
        "open_date": {
          "type": "date",
          "format": "yyyy-MM-dd"
        },
        "version_id": {
          "type": "string"
        },
        "fullTextURL": {
          "type": "string"
        },
        "file": {
          "type": "attachment",
          "fields": {
            "content": {
              "type": "string",
              "term_vector": "with_positions_offsets",
              "store": true,
              "fields": {
                "jp": {
                  "type": "string",
                  "term_vector": "with_positions_offsets",
                  "store": "yes",
                  "analyzer": "ja_analyzer"
                },
                "en": {
                  "type": "string",
                  "term_vector": "with_positions_offsets",
                  "store": "yes",
                  "analyzer": "ngram_analyzer"
                }
              }
            }
          }
        }
      }
    }
  }
}
'

