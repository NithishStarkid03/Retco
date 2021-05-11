import React, { Component } from 'react'
import {CardFooter, Col, Container,Row, Table} from 'reactstrap'
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button } from 'reactstrap';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

class Productcategory extends Component {
    constructor(props){
        super(props)
        this.state={
            product:this.props.location.prod,
            catname:this.props.location.name
            

        }
        console.log(this.props.location.prod)
    }
    
  
       
    
      
    render() {



        let productdisplay=this.state.product.map((cat)=>{
            return(
                <>
                
                
              {cat.productGroups.map((pr,ind)=>{
            let url=`http://retco-server.us-east-1.elasticbeanstalk.com/api/image/${pr.imageId}`
                return(
                    <div className="col-10 col-md-4 mt-5" key={ind}>
                    <Card>
                    <CardImg top  width="200" height="200"  src={url} alt={pr.name} />
                    <CardBody>
                       
                        <CardTitle tag="h5">{pr.name}{' '}</CardTitle>

                        <Row><Col>DESCRIPTION:{' '}<b>{pr.description}</b></Col></Row>
                        <Row><Col>HSN:{' '}<b>{pr.hsn}</b></Col></Row>
                        <Row><Col>MEASUREMENT TYPE:{' '}<b>{pr.measurementType}</b></Col></Row>
                        <Row>
                            <Col xs="auto">
                            VARIANT:
                        <Table size="sm">
                            <thead>
                                <tr>
                                    <th>SNo</th>
                                    <th>Quantity</th>
                                    <th>Measurement Unit</th>
                                </tr>
                            </thead>
                            <tbody>
                            {pr.products.map((variant,i)=>{
                                return(
                                    <tr key={i}>
                                        <td>{i+1}</td>
                                        <td>{variant.quantity}</td>
                                        <td>{variant.measurementUnit}</td>

                                    </tr>
                                )
                              

                            })}

                            </tbody>
                            
                        </Table>
                        </Col>
                        </Row>
                    </CardBody>
                    <CardFooter>
                        <Button color="primary" size="sm">EDIT</Button>{' '}
                        <Button color="danger" size="sm">DELETE</Button>
                        
                    </CardFooter>
                    </Card>
                    </div>
  
                )


              })}
                
      
             </>    

      
      )
        })


        return (
            <Container>
                <center><h3>{this.state.catname.toUpperCase()}</h3></center>
                
                <div className="container-fluid mt-5">
                <div className="row">
                {
                productdisplay
                }
                </div>
                </div>
  
            </Container>
            )
    }
}

export default Productcategory
