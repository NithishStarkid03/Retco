import React, { Component } from 'react';
import { Button,Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Table} from 'reactstrap';


class Editmodal extends Component {
    
    constructor(props) {
        super(props);
        this.handleSave = this.handleSave.bind(this);
        this.state = {
            productgroupId: '',
            prodcost: '',
            priceperunitquantity:'',
            totalunits:'',
            measurementunit:'',
            quantityperunit:'',

        }
       
      


    }

    componentWillReceiveProps(nextProps){

        this.setState({
            productgroupId: nextProps.productgroupId,
            prodcost: nextProps.prodcost,
            priceperunitquantity:nextProps.priceperunitquantity,
            totalunits:nextProps.totalunits,
            measurementunit:nextProps.measurementunit,
            quantityperunit:nextProps.quantityperunit

        })
    }


    handleSave() {
        const item = this.state;
        this.props.saveModalDetails(item)
    }
      


    render() {
        return (
        <div className="modal" id="editmodal" tabIndex="-1" role="dialog">
        
        <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                        <h5 className="modal-title" id="editmodal">Edit</h5>
                        </div>
        
        <div className="modal-body">
        <FormGroup>
            <Label for="productgroupId">PRODUCT GROUPID</Label>
            <Input id="productgroupid" value={this.state.productgroupId} onChange={(e) => {
            
              this.setState({ productgroupId: e.target.value});
            }} />
          </FormGroup>
          <FormGroup>
            <Label for="productcost">PRODUCT COST</Label>
            <Input id="productcost" value={this.state.prodcost} onChange={(e) => {
            
              this.setState({ prodcost: e.target.value});
            }} />
          </FormGroup>
          <FormGroup>
            <Label for="priceperunitquantity">PRICEPER UNIT QUANTITY</Label>
            <Input id="priceperunitquantity" value={this.state.priceperunitquantity} onChange={(e) => {
              
              this.setState({ priceperunitquantity:e.target.value });
            }} />
          </FormGroup>

          <FormGroup>
            <Label for="totalunits">TOTAL UNITS</Label>
            <Input id="totalunits" value={this.state.totalunits}  onChange={(e) => {

              this.setState({ totalunits:e.target.value });
            }} />
          </FormGroup>
          <FormGroup>
            <Label for="measurementunit">MEASUREMENT UNIT</Label>
            <Input id="measurementunit" value={this.state.measurementunit}  onChange={(e) => {
             
              this.setState({ measurementunit:e.target.value });
            }} />
          </FormGroup>
          <FormGroup>
            <Label for="quantityperunit">QUANTITY PER UNIT</Label>
            <Input id="quantityperunit"  value={this.state.quantityperunit} onChange={(e) => {

              this.setState({ quantityperunit: e.target.value});
            }} />
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
