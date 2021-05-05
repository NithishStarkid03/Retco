import React, { Component } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Table,Input,Row,Col
} from "reactstrap";
import ReactToPrint from "react-to-print";
import Barcode from "react-barcode";

class Modalchild extends Component {
  constructor(props) {
    super(props);
    this.state = {
      barcode: [],

      flag: false,
      open: false,
      target: "",
      chk:false
    };
  }
  UNSAFE_componentWillReceiveProps(props) {
    this.setState({
      barcode: props.barcodedet,
      flag: props.flag
    });
    console.log("recieved:", this.state.barcode, ":::", this.state.flag);
  }

  deletegenerated(id) {
    let temp = this.state.barcode.filter((i) => i.batchCode !== id);
    if (temp.length > 0) {
      this.setState({
        barcode: temp,
        open: !this.state.open,
        chk:!this.state.chk
      });
    } else {
      console.log("vandha solu");
      this.setState({
        barcode: temp,
        open: !this.state.open,
        chk:!this.state.chk,
        flag: !this.state.flag
      });
      console.log("tantan",!this.state.flag);
      this.props.barcodecallback(!this.state.flag)
  
    }
    
  }

  toggle = () => {
    this.setState({ flag: !this.state.flag });
  };

  render() {
    let datas = this.state.barcode.map((it, ind) => {
      return (
        <tr>
          <td>{ind + 1}</td>
          <td>{it.batchCode}</td>
          <td>{it.productGroupId}</td>
          <td>{it.productGroupName}</td>
          <td>
            <Button
              color="primary"
              onClick={() => {
                this.setState({ open: !this.state.open, target: it.batchCode });
              }}
            >
              GENERATE
            </Button>
          </td>
        </tr>
      );
    });
    return (
      <div>
        <div>
          <Modal isOpen={this.state.flag} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle}>BARCODE</ModalHeader>
            <ModalBody>
              <Table responsive>
                <thead>
                  <tr>
                    <th>SNo</th>
                    <th>BATCH CODE</th>
                    <th>PRODUCT ID</th>
                    <th>PRODUCT NAME</th>
                    <th>BARCODE GENERATE</th>
                  </tr>
                </thead>
                <tbody>{datas}</tbody>
              </Table>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.toggle}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </div>

        <div>
          <Modal isOpen={this.state.open}>
            <ModalHeader>Barcode</ModalHeader>

            <ModalBody>
                <Table responsive>
                    <thead>BAR CODE</thead>
                    <tbody>
                        <td><ComponentToPrint
                ref={(el) => (this.componentRef = el)}
                data={this.state.target}
                
              />
              </td>
                    </tbody>
              </Table>
            </ModalBody>
            <ModalFooter>
              <Row>
              <Col>
              <ReactToPrint
                trigger={() => <Button>Print</Button>}
                content={() => this.componentRef}
              />
              </Col>
              <Col >
              <Input type="checkbox" onClick={()=>{this.setState({chk:!this.state.chk})}}/>{' '}
                PRINTED</Col>
                <Col>
              {this.state.chk?(
              <Button onClick={() => this.deletegenerated(this.state.target)}>
                Close
              </Button>
              ):(<h1>{''}</h1>)}
              </Col>
              </Row>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    );
  }
}

class ComponentToPrint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bar: this.props.data
    };
    console.log("hey", this.props.data);
  }

  render() {
    return (
      <div>
        <Barcode
          value={this.state.bar}
          lineColor="black"
          width="8"
          height="200"
          format="CODE128"
          displayValue="true"
          font="monospace"
          textAlign="center"
          textMargin="5"
          fontSize="12"
          margin="10"
          marginTop="10"
          marginBottom="10"
          marginLeft="10"
          marginRight="10"
        />
      </div>
    );
  }
}

export default Modalchild;
