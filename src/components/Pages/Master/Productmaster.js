import React, { Component } from 'react'
import { Col, Container ,Row} from 'reactstrap';
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button } from 'reactstrap';
import axios from 'axios'
import { Link } from 'react-router-dom';



class Productmaster extends Component {

    constructor(props){
        super(props)
        this.state={
            products:[],
            productsundercategory:[],
            categorypage:null

        }
    }

componentDidMount()
{
    this.getproducts()
}


getproducts(){
    axios.get('http://localhost:8007/productmaster').then(res=>{
        console.log('products:',res.data)
        this.setState({
            products:res.data
        })
    })
}

choosecategory(id,name){

    const prod=this.state.products.filter((pr)=>id===pr.id)
    console.log(prod)
    this.setState({
        categorypage:name,
        productsundercategory:prod
    })
    
    
}

    render() {


        let categorydisplay=this.state.products.map((cat,ind)=>{
            let url=`http://retco-server.us-east-1.elasticbeanstalk.com/api/image/${cat.imageId}`
            return(
              


                
                      <div className="col-10 col-md-4 mt-5" key={ind}>
                        <Card>
                        <CardImg top  width="200" height="200"  src={url} alt={cat.name} />
                        <CardBody>
                            <CardTitle tag="h5">{cat.name}</CardTitle>
                            <Link to={{pathname:`/master/productmaster/${cat.id}`, prod:this.state.products.filter((pr)=>cat.id===pr.id),name:cat.name,id:cat.id}}>
                           <Button color="success">PRODUCTS</Button>
                           </Link>

                            
                        </CardBody>
                        </Card>
                        </div>
            
                     

            
            )
        
        })

        return (
            <Container fluid>
                <div className="App">
                    <center><h3>PRODUCT MASTER</h3></center>
                    <br></br>
                    <div className="container-fluid mt-5">
                <div className="row text-center">
                {categorydisplay}
                </div>
            </div>

            
           
            
                </div>
    
            </Container>
            )
    }
}

export default Productmaster
