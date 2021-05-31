import axios from 'axios';
import React, { Component } from 'react'
import { Container,Table,Row } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import './pagination.css';
import DeleteIcon from '@material-ui/icons/Delete';

class Warehousestock extends Component {

    constructor(props){
        super(props);
        this.state={
            packedstock:[],
            baseurl:'http://retco-server.us-east-1.elasticbeanstalk.com/api',

            searchdata:[],
            searchinput:'',
            offset:0,
            perpage:2,
            currentpage:0,
            pagecount:0
        }
        this.handlePageClick = this.handlePageClick.bind(this);
    }

    componentDidMount(){
        this.getpackedstock()
    }

    getpackedstock(){
        //`${this.state.baseurl}/warehouse/packed/all`
        axios.get('http://localhost:8017/warehousestock').then(res=>{
            console.log('packed data',res.data)

            let temp=[]
            temp=res.data
            var split=temp.slice(this.state.offset, this.state.offset + this.state.perpage)


            this.setState({
                packedstock:res.data,
                pagecount:Math.ceil(temp.length/this.state.perpage),
                searchdata:split
            })
        })
    }


    handlePageClick=(e)=>{
        const selectedpage=e.selected;
        const offset=selectedpage*this.state.perpage
      
      
      this.setState({
        currentpage:selectedpage,
        offset:offset
      },()=>{
      
        this.loaddata()
      
      })
      
      }
      
      loaddata(){
      
        const data=this.state.packedstock
      
        const split=data.slice(this.state.offset,this.state.offset+this.state.perpage)
      
        this.setState({
      
          pagecount:Math.ceil(data.length/this.state.perpage),
          searchdata:split
      
        })
      
      }
      
    

     
    handlesearch=(e)=>{
        this.setState({searchinput:e.target.value},()=>{
      
      
          this.globalsearch();
      
        })
      }
      
      globalsearch=()=>{
      
      let searchinput=this.state.searchinput;
      let filterdata=this.state.packedstock.filter(val=>{
      
      return(
        val.batchCode.toLowerCase().includes(searchinput.toLowerCase()) ||
        val.productGroupName.toLowerCase().includes(searchinput.toLowerCase()) ||
        val.timestamp.toLowerCase().includes(searchinput.toLowerCase())
      )

      })
      this.setState({
      searchdata:filterdata
      })
      }

    render() {
        return (
            <Container>
                <div className="App">
                <center><h4>WAREHOUSE STOCK</h4></center>
                <br></br>
                <b>Search</b>: <input
        style={{ marginLeft: 5 }}
        type="text"
        placeholder="Type to search..."
        value={this.state.searchinput}
        onChange={e => this.handlesearch(e)}
      
        />
        <DeleteIcon onClick={()=>this.setState({searchinput:'',searchdata:this.state.packedstock})}></DeleteIcon>
        {this.state.searchdata.length === 0 && <span>No records found!</span> }
        <br></br>
                <Table hover size="lg">
                    <thead>
                        <tr>
                            <th>SNo</th>
                            <th>PRODUCT NAME</th>
                            <th>BATCH CODE</th>
                            <th>PACKED DATE</th>
                            <th>TOTAL STOCK</th>
                            <th>EFFECTIVE STOCK</th>
                            <th>DELIVERED STOCK</th>
                            <th>INTRANSIT STOCK</th>
                            <th>VARIANT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.searchdata.map((ps,ind)=>{
                            return(
                                <tr key={ind}>
                                    <td>{ind+1}</td>
                                    <td>{ps.productGroupName}</td>
                                    <td>{ps.batchCode}</td>
                                    <td>{ps.timestamp.substring(0,10)}</td>
                                    <td>{ps.totalStock}</td>
                                    <td>{ps.effectiveStock}</td>
                                    <td>{ps.deliveredStock}</td>
                                    <td>{ps.inTransitStock}</td>
                                    <td>{ps.quantity+' '+ps.measurementUnit}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
                <Row>
                    <ReactPaginate
                    previousLabel={"prev"}
                    nextLabel={"next"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={this.state.pagecount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageClick}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}/>
                    </Row>
                </div>
            </Container>
            
        )
    }
}

export default Warehousestock
