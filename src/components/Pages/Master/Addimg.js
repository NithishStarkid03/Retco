import React, { Component } from 'react'
import { Button, Container, FormGroup, Label } from 'reactstrap';

class Addimg extends Component {

    constructor(props){
        super(props);
        this.state={
            name:'',
            description:'',
            imgId:'',
            measurementType:'',
            products:[],
            hsn:'',
            category:'',
            check:false,
            redirectflag:false

        }
    }
    
    componentWillReceiveProps(proddata){
        this.setState({
            name:proddata.name,
            description:proddata.description,
            hsn:proddata.hsn,
            products:proddata.products,
            category:proddata.category,
            measurementType:proddata.measurementType

        })

        console.log(proddata)

    }

    render() {
        return (
            <Container>
                 <div>
                    
                     <FormGroup row>
                         <Label for="imgofproduct">ADD IMAGE</Label>
                         <Col sm={3}>
                         <Button color="primary">UPLOAD IMAGE</Button>
                         </Col>
                         
                     </FormGroup>
                     <br></br>
                     <Row>
                     <Col md={12}>
                     <Card>
                    
                    <CardBody>
                   
                    
                    
                    <CardTitle tag="h5" >PRODUCT DETATILS</CardTitle>
                   
                    
                   <Row> <Col sm={8}>PRODUCT NAME: {this.state.name}</Col></Row>
                    <br></br>
                    <Row><Col sm={8}>DESCRIPTION : {this.state.description}</Col></Row>
                    <br></br>
                    
                   <Row><Col sm={8}> HSN: {this.state.hsn}</Col></Row>
                   <br></br>

                   <Row><Col sm={8}> MEASUREMENT TYPE: {this.state.measurementType}</Col></Row>
                   <br></br>

                   <Row><Col sm={8}> CATEGORY: {this.state.category}</Col></Row>
                   <br></br>
 
                    
                    
                    VARIANT DETAILS
                    <Row>
                    <Col sm={6}>
                    <Table size="sm"> 
                        <thead>
                            <tr>
                                <th>SNo</th>
                                <th>Quantity</th>
                                <th>Measurement Unit</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                                {this.state.products.length>0?(this.state.products.map((it,index)=>{

                                    return(
                                        <tr key={index}>
                                            <td>{index+1}</td>
                                            <td>{it.quantity}</td>
                                            <td>{it.measurementUnit}</td>
                                        </tr>


                                    )


                                }

                                )):(<></>)}
                            </tbody>
                        
                    </Table>
                    </Col>
                    </Row>
                    </CardBody>
                    </Card>
                    </Col>
                     </Row>
                    
                
                </div>
            </Container>
           
        )
    }
}

export default Addimg
/*  <Addimg name={this.state.name} hsn={this.state.hsn} measurementType={this.state.measurementType} products={this.state.products} description={this.state.description}
             category={this.state.category} redirect={this.redirecttoaddproduct}
            />*/ 