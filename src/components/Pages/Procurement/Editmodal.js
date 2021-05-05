import React, { Component } from 'react';
import { Button,Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Table,Row,Col} from 'reactstrap';
import axios from 'axios';
import DeleteIcon from '@material-ui/icons/Delete';

class Editmodal extends Component {
    
    constructor(props) {
        super(props);
        this.handleSave = this.handleSave.bind(this);
        this.state = {
            productgroupId: '',
            tax:0,
            priceperunit:0,
            totalunits:0,
            measurementunit:'',
            quantityperunit:0,
            productdet:[],
            taxflag:0,
           
           
            

        }
       
      


    }

    componentWillReceiveProps(nextProps){

        this.setState({
            productgroupId: nextProps.productgroupId,
            tax: nextProps.tax,
            priceperunit:nextProps.priceperunit,
            totalunits:nextProps.totalunits,
            measurementunit:nextProps.measurementunit,
            quantityperunit:nextProps.quantityperunit,
            productdet:nextProps.productdet,
            taxflag:((nextProps.tax/100))*(nextProps.priceperunit*nextProps.totalunits)
            

        })
      }

    handleSave() {
        const item = {

          productgroupId:this.state.productgroupId,
          tax:this.state.tax,
          priceperunit:this.state.priceperunit,
          totalunits:this.state.totalunits,
          measurementunit:this.state.measurementunit,
          quantityperunit:this.state.quantityperunit,

        };
        this.props.saveModalDetails(item)
    }
      

    deltax(id){
      if(id==='taxpercent'){
        document.getElementById('taxpercent').value = ''
        this.setState({taxflag:0,tax:0})
      }
    else{
      document.getElementById('taxamt').value = ''
      this.setState({taxflag:0,tax:0})
    }

    }

    render() {
        return (
        <div className="modal" id="editmodal" >
        
        <div className="modal-dialog" >
                    <div className="modal-content">
                        <div className="modal-header">
                        <h5 className="modal-title" id="editmodal">Edit</h5>
                        </div>
        
        <div className="modal-body">
        <FormGroup>
            <Label for="productgroupId">PRODUCT GROUPID</Label>
            <Input list="productgroupId"  placeholder={this.state.productgroupId} onChange={(e) => {
            
              this.setState({ productgroupId: e.target.value});
            }} />
            <datalist id="productgroupId">
              {
                
                  this.state.productdet.map(result=>
                    {
                      
                      return(
                        <option>
                        {result.productgroupName}</option>
                      )
                    }
                    
                    )
                
              }

            </datalist>

          </FormGroup>
          <FormGroup>
            <Label for="priceperunitquantity">PRICE PER UNIT</Label>
            <Input id="priceperunitquantity" value={this.state.priceperunit} onChange={(e) => {
               if((e.target.value)===''){
                this.setState({ priceperunit:0})   
               }
               else{
                this.setState({ priceperunit:parseFloat(e.target.value) });
               }
              
              
            }} />
          </FormGroup>

          <FormGroup>
            <Label for="totalunits">TOTAL UNITS</Label>
            <Input id="totalunits" value={this.state.totalunits}  onChange={(e) => {
                  if((e.target.value)===''){
                    this.setState({ totalunits:0})   
                  }
                  else{
              this.setState({ totalunits:parseFloat(e.target.value) });}
            }} />
          </FormGroup>
          <FormGroup>
            <Label for="measurementunit">MEASUREMENT UNIT</Label>
            <Input id="measurementunit" value={this.state.measurementunit}  onChange={(e) => {
             
              this.setState({ measurementunit:e.target.value });
            }} />
          </FormGroup>
          <FormGroup>
            <Label for="productcost">PRODUCT COST</Label>
            <Input id="productcost" value={this.state.totalunits*this.state.priceperunit} 
            />
          </FormGroup>
         
         
          <FormGroup>
            <Label for="quantityperunit">QUANTITY PER UNIT</Label>
            <Input id="quantityperunit"  value={this.state.quantityperunit} onChange={(e) => {

              this.setState({ quantityperunit: parseFloat(e.target.value)});
            }} />
          </FormGroup>

          <FormGroup>
          <Label for="tax">TAX</Label>
          <Row>
            <Col>
          <Label for="taxpercent">PERCENTAGE</Label>
            </Col>
            
            <Col>
          
          <Label for="taxamt">AMOUNT</Label>
          
          </Col>
          </Row>
          <Row>
            <Col>
          <Input id="taxpercent" placeholder={this.state.tax+'%'} onChange={(e)=>{
            
            if(e.target.value===''){

              var temp=0
              this.setState({tax:temp,taxflag:temp})
            
            }
            else{
              var temp=parseFloat(e.target.value)

              let taxamt=(1*this.state.priceperunit*this.state.totalunits)*parseFloat(e.target.value/100)

            this.setState({tax:temp,taxflag:taxamt})
            
            } 
            }}/></Col>
            <Col>
             <DeleteIcon onClick={()=>this.deltax('taxpercent')}/>
            </Col>
            <Col>
          <Input id="taxamt" placeholder={'Rs'+this.state.taxflag} onChange={(e)=>{
            
            if(e.target.value===''){

              var temp=0
              this.setState({tax:temp,taxflag:temp})
            
            }
            else{
              
              var temp=parseFloat(e.target.value)

              let taxpercent=(temp*100)/(this.state.priceperunit*this.state.totalunits)

            this.setState({tax:taxpercent,taxflag:taxpercent})
            
            } 
            }} />
            </Col>
            <Col>
             <DeleteIcon onClick={()=>this.deltax('taxamt')}/>
            </Col>
           
           
            </Row>
            
          </FormGroup>



          <FormGroup>
            <Label for="productcostwithtax">PRODUCT COST WITH TAX</Label>
           
            <Input id="productcostwithtax" value={(1*this.state.totalunits*this.state.priceperunit)*(1+(this.state.tax/100))}
            />
            
          </FormGroup>










         
            </div>
         
    

            <div className="modal-footer">
          <Button color="primary"   data-dismiss="modal" onClick={() => { this.handleSave() }}>Edit</Button>{' '}
          <Button color="secondary" data-dismiss="modal" >Cancel</Button>
    
          </div>

          </div>
          </div>

        </div>
        )
    }
}

export default Editmodal
