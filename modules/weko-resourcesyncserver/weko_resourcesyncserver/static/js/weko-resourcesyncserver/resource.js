const list_label = "List"
const create_label = "Create"
const edit_label = "Edit"
const detail_label = "Detail"
const urlCreate =  window.location.origin + '/admin/resource/create'
const urlGetList =  window.location.origin + '/admin/resource/get_list'
const urlGetTreeList =  window.location.origin + '/api/tree'
const default_state = {
  status: false,
  repository: '',
  resource_dump_manifest: false,
  url_path: ''
}

class MainLayout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          current_step: 1,
          current_tab: 'list',
          tabs: [
            {
              tab_key: 'list',
              tab_name: list_label,
              step: 1
            },
            {
              tab_key: 'create',
              tab_name: create_label,
              step: 1

            },
            {
              tab_key: 'edit',
              tab_name: edit_label,
              step: 2,
            },
            {
              tab_key: 'detail',
              tab_name: detail_label,
              step: 2,
            }
          ],
        }
        this.handleChangeTab = this.handleChangeTab.bind(this)

    }

    componentDidMount() {
    }

    handleChangeTab(select_tab, select_item = {}) {
      const { tabs } = this.state
      const a = tabs.filter(item => {
        return item.tab_key === select_tab
      })
      if (a[0]) {
        const item = a[0]
        this.setState({
          current_tab: item.tab_key,
          current_step: item.step
        })
        if(select_item){
          this.setState({
            select_item: select_item,
          })
        }
      }
    }


    render() {
        const { tabs, current_step, current_tab } = this.state
        return (
            <div className="resource row">
              <ul className="nav nav-tabs">
                {
                  tabs.map((item, key) => {
                    if (item.step <= current_step){
                      return (
                        <li role="presentation" className={`${item.tab_key === current_tab ? 'active' : ''}`} onClick={() => this.handleChangeTab(item.tab_key)}><a href="#">{item.tab_name}</a></li>
                      )
                    }
                  })
                }
              </ul>

              {current_tab === tabs[0].tab_key ? <div>
                <ListResourceComponent
                  handleChangeTab={this.handleChangeTab}
                ></ListResourceComponent>
              </div> : ''}

              {current_tab === tabs[1].tab_key ? <div>
                <CreateResourceComponent
                  handleChangeTab={this.handleChangeTab}
                ></CreateResourceComponent>
              </div> : ''}

              {current_tab === tabs[2].tab_key ? <div>
                <EditResourceComponent
                  handleChangeTab={this.handleChangeTab}
                ></EditResourceComponent>
              </div> : ''}

              {current_tab === tabs[3].tab_key ? <div>
                <DetailResourceComponent
                  handleChangeTab={this.handleChangeTab}
                ></DetailResourceComponent>
              </div> : ''}

            </div>
        )
    }
}

class ListResourceComponent extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      list_resource: []
    }
    this.handleGetList = this.handleGetList.bind(this)
  }

  componentDidMount() {
    this.handleGetList()
  }

  handleGetList() {
    fetch(urlGetList, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(res => res.json())
    .then(res => {
        console.log(res)
        this.setState({
          list_resource: res
        })
    })
    .catch(() => alert('Error in get list'));
  }

  render(){
    const {list_resource} = this.state
    return(
      <div className="row list_resource">
        <div className="col-md-12 m-t-20">
            <table class="table table-striped table-bordered">
              <thead>
                <tr>
                  <th></th>
                  <th><p className="">Repository</p></th>
                  <th><p className="">Resource List Url</p></th>
                  <th><p className="">Resource Dump Url</p></th>
                  <th><p className="">status</p></th>
                </tr>
              </thead>
              <tbody>
                {
                  list_resource.map((item, key) => {
                    return (
                      <tr key={key}>
                        <td>
                          {key + 1}
                        </td>
                        <td>{item.repository}</td>
                        <td>
                          <a href={item.url_path+'/resource_list'}  target="_blank">{item.url_path+'/resource_list'}</a>

                        </td>
                        <td>
                           <a href={item.url_path+'/resource_dump'}  target="_blank">{item.url_path+'/resource_dump'}</a>
                        </td>
                        <td>{item.status}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
      </div>
    )
  }
}



class CreateResourceComponent extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      ...default_state,
      tree_list: []
    }
    this.handleChangeState = this.handleChangeState.bind(this)
    this.handleChangeURL = this.handleChangeURL.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.generateTreeList = this.generateTreeList.bind(this)
    this.getTreeList = this.getTreeList.bind(this)
  }

  handleChangeState(name, value) {
    const {state} = this
    this.setState({
      ...state,
      [name]: value
    },() => {
      if (name === 'repository'){
        this.handleChangeURL()
      }
    })
  }

  handleChangeURL(){
    const {state} = this
    const {repository} = state
    const url_path = window.location.origin + '/resource/'+ repository
    this.handleChangeState('url_path',url_path)
  }

  handleSubmit(){
    console.log(this.state)
    const new_data = {...this.state}
    delete new_data.tree_list;
    fetch(urlCreate, {
      method: 'POST',
      body: JSON.stringify(new_data),
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(res => res.json())
    .then(res => {
        console.log(res)
        if (res.success) {
           this.props.handleChangeTab('list')
        }
        else {
          alert('Error in Create')
        }
    })
    .catch(() => alert('Error in Create'));
  }

  getTreeList() {
    fetch(urlGetTreeList, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(res => res.json())
    .then(res => {
        console.log(res)
        let treeList = []
        res.map(item => {
          treeList = [...treeList, ...this.generateTreeList(item, '')]
        })
        this.setState({
          tree_list : treeList
        })
    })
    .catch(() => alert('Error in get Tree list'));
  }

  generateTreeList(item ,path = '') {
    const real_path = path ? (path + ' / ' + item.value) : (item.value)
    if(!item.children.length) {
      return [{id: item.id, value: real_path}]
    } else {
      let result = []
      item.children.map(i => {
        result = [...result, ...this.generateTreeList(i, real_path )]
      })
      return [{id: item.id, value: real_path}, ...result, ]
    }
  }

  componentDidMount() {
    this.getTreeList()
  }

  render(){
    const {state} = this
    console.log(state)
    return(
      <div className="create-resource">

        <div className="row form-group flex-baseline">
          <div className="col-md-4 text-right">
            <label>Status</label>
          </div>
          <div className="col-md-8">
            <input type="checkbox" onChange={(e) => {
              const value = e.target.checked
              this.handleChangeState('status', value)
            }}></input>
          </div>
        </div>

        <div className="row form-group flex-baseline">
          <div className="col-md-4 text-right">
            <label>Repository</label>
          </div>
          <div className="col-md-8">
            <select className="form-control"
              onChange={(e) => {
                const value = e.target.value
                this.handleChangeState('repository', value)
              }}
            >
              <option value=""></option>
              {
                state.tree_list.map(item => {
                  return <option value={item.id}>{item.value}</option>
                })
              }
            </select>
          </div>
        </div>

        <div className="row form-group flex-baseline">
          <div className="col-md-4 text-right">
            <label>Resource Dump Manifest</label>
          </div>
          <div className="col-md-8">
            <input
              type="checkbox"
              onChange={(e) => {
                const value = e.target.checked
                this.handleChangeState('resource_dump_manifest', value)
              }}
            ></input>
          </div>
        </div>

        <div className="row form-group flex-baseline">
          <div className="col-md-4 text-right">
            <label>Resource List uri</label>
          </div>
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              disabled
              value={state.url_path && state.url_path+'/resource_list'}
            ></input>
          </div>
        </div>

        <div className="row form-group flex-baseline">
          <div className="col-md-4 text-right">
            <label>Resource Dump uri</label>
          </div>
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              disabled
              value={state.url_path && state.url_path+'/resource_dump'}

            ></input>
          </div>
        </div>

        <div className="row form-group flex-baseline">
          <div className="col-md-4 text-right">
            <label>Auto start after save</label>
          </div>
          <div className="col-md-8">
            <input type="checkbox"></input>
          </div>
        </div>

        <div className="row form-group flex-baseline">
          <div className="col-md-4">
          </div>
          <div className="col-md-8">
            <button
                  className="btn btn-primary"
                  onClick={() => { this.handleSubmit()}}
                >
                  Save
             </button>
             <button
                  className="btn btn-default"
                  onClick={() => {  }}
                >
                  Save add Add Another
             </button>
             <button
                  className="btn btn-danger"
                  onClick={() => { this.props.handleChangeTab('edit') }}
                >
                  Cancel
             </button>
          </div>
        </div>
      </div>
    )
  }
}


class EditResourceComponent extends React.Component {
  constructor(props){
    super(props)
    this.state = {

    }
  }

  render(){
    return(
      <div>
        Edit ne
      </div>
    )
  }
}


class DetailResourceComponent extends React.Component {
  constructor(props){
    super(props)
    this.state = {

    }
  }

  render(){
    return(
      <div>
        Deatil ne
      </div>
    )
  }
}
$(function () {
    ReactDOM.render(
        <MainLayout />,
        document.getElementById('root')
    )
});
