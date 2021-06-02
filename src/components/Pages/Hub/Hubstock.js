import axios from 'axios';
import React, { Component } from 'react'
import { Container, Table,Row } from 'reactstrap';
import ReactPaginate from 'react-paginate';
import './pagination.css';
import DeleteIcon from '@material-ui/icons/Delete';

class Hubstock extends Component {
    constructor(props){
        super(props);
        this.state={
        hubstock:[],
        searchdata:[],
        searchinput:'',
        offset:0,
        perpage:5,
        currentpage:0,
        pagecount:0
    }
    this.handlePageClick = this.handlePageClick.bind(this);
    }
componentDidMount(){
    this.getstocks()
}

getstocks(){
    axios.get('http://localhost:8021/hubstocks').then(res=>{
        console.log('hub stocks',res.data)
        let temp=[]
        temp=res.data
        var split=temp.slice(this.state.offset, this.state.offset + this.state.perpage)

        this.setState({
            hubstock:res.data,
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
  
    const data=this.state.hubstock
  
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
  let filterdata=this.state.hubstock.filter(val=>{
  
  return(
    val.batchCode.toLowerCase().includes(searchinput.toLowerCase()) ||
    val.productName.toLowerCase().includes(searchinput.toLowerCase()) 
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
                <center><h4>HUB STOCKS</h4></center>
                <br></br>
                <b>Search</b>: <input
        style={{ marginLeft: 5 }}
        type="text"
        placeholder="Type to search..."
        value={this.state.searchinput}
        onChange={e => this.handlesearch(e)}
      
        />
        <DeleteIcon onClick={()=>this.setState({searchinput:'',searchdata:this.state.hubstock})}></DeleteIcon>
        {this.state.searchdata.length === 0 && <span>No records found!</span> }
        <br></br>
                <Table hover>
                    <thead>
                        <tr>
                            <th>SNo</th>
                            <th>BATCH CODE</th>
                            <th>PRODUCT NAME</th>
                            <th>VARIANT</th>
                            <th>EFFECTIVE STOCK</th>
                            <th>TOTAL STOCK</th>
                            <th>INTRANSIT STOCK</th>
                            <th>DELIVERED STOCK</th>
                            <th>MRP</th>
                            <th>SELLING PRICE</th>
                        </tr>
                        </thead>
                        <tbody>
                            {this.state.searchdata.map((hs,ind)=>{
                                return(
                                    <tr key={ind}>
                                        <td>{ind+1}</td>
                                        <td>{hs.batchCode}</td>
                                        <td>{hs.productName}</td>
                                        <td>{hs.quantity+' '+hs.measurementUnit}</td>
                                        <td>{hs.effectiveStock}</td>
                                        <td>{hs.totalStock}</td>
                                        <td>{hs.inTransitStock}</td>
                                        <td>{hs.deliveredStock}</td>
                                        <td>Rs.{hs.mrp}</td>
                                        <td>Rs.{hs.sellingPrice}</td>
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

export default Hubstock
