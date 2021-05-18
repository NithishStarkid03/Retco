import axios from 'axios';
import React, { Component } from 'react'
import { Container,Table ,Row,Col} from 'reactstrap';
import ReactPaginate from 'react-paginate';
import './pagination.css';
import DeleteIcon from '@material-ui/icons/Delete';

class Pricinghistory extends Component {
    constructor(props){
        super(props);
        this.state={
            pricelist:[],
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
        this.getprice()
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
  
    const data=this.state.pricelist
  
    const split=data.slice(this.state.offset,this.state.offset+this.state.perpage)
  
    this.setState({
  
      pagecount:Math.ceil(data.length/this.state.perpage),
      searchdata:split
  
    })
  
  }
  

    getprice(){
        axios.get("http://localhost:8010/pricinghistory").then(res=>{
            console.log(res.data)
            let temp=[]
            temp=res.data
            var split=temp.slice(this.state.offset, this.state.offset + this.state.perpage)


            this.setState({
                pricelist:res.data,
                pagecount:Math.ceil(temp.length/this.state.perpage),
                searchdata:split
            })
        })
    }

    
    handlesearch=(e)=>{
        this.setState({searchinput:e.target.value},()=>{
      
      
          this.globalsearch();
      
        })
      }
      
      globalsearch=()=>{
      
      let searchinput=this.state.searchinput;
      let filterdata=this.state.pricelist.filter(val=>{
      
      return(
        val.procuredProductName.toLowerCase().includes(searchinput.toLowerCase()) 
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
                <center><h3>PRICING HISTORY</h3></center>
                <br></br>
                <Row>    
                <b>Search</b>: <input
        style={{ marginLeft: 5 }}
        type="text"
        placeholder="Type to search..."
        value={this.state.searchinput}
        onChange={e => this.handlesearch(e)}
      
        />
        <DeleteIcon onClick={()=>this.setState({searchinput:'',searchdata:this.state.pricelist})}></DeleteIcon>
        {this.state.searchdata.length === 0 && <span>No records found!</span> }
        <br></br>
            

                <Table>
                    <thead>
                        <tr>
                            <th>SNo</th>
                            <th>Product Name</th>
                            <th>Wastage%</th>
                            <th>Tax Slab%</th>
                            <th>Profit Margin %</th>
                            <th>Mrp%</th>
                            <th>Packing Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.searchdata.map((pr,ind)=>{

                            return(
                                <tr key={ind}>
                                <td>{ind+1}</td>
                                <td>{pr.procuredProductName}</td>
                                <td>{pr.wastage}</td>
                                <td>{pr.taxSlab}</td>
                                <td>{pr.profitMargin}</td>
                                <td>{pr.mrp}</td>
                                <td>
                                {pr.packingCosts.map((pc,i)=>{
                                    return(
                                        <li>{pc.productName}:{' '}Rs.{pc.cost}</li>
                                    )
                                })}
                                
                                </td>
                                </tr>

                            )

                        })}
                        
                    </tbody>

                </Table>
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

export default Pricinghistory
