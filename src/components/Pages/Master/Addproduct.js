import { Button, Card, CardBody, CardFooter, CardTitle, Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap';
import React, { Component } from 'react'
import { Container,Row,Col,Form,FormGroup ,Input,Label} from 'reactstrap';
import DeleteIcon from '@material-ui/icons/Delete';
import axios,{post} from 'axios';
import ImageUploader from 'react-images-upload';

class Addproduct extends Component {

    constructor(props){
        super(props);
        this.state={
            name:'',
            description:'',
            imgId:'',
            measurementType:'',
            products:[],
            availcategory:[],
                

           
            newquantity:0,
            newmeasurementUnit:'',
            variantflag:false,
            hsn:'',
            category:'',
            promptnewseller:0,
            check:false,
            imageflag:false,
            checkimg:false,
            pic:null


        }
        this.onDrop = this.onDrop.bind(this);
        this.onimgsubmit = this.onimgsubmit.bind(this)
        this.fileUpload = this.fileUpload.bind(this)
    }
    componentDidMount(){
        this.getcategory();
    }

    getcategory(){
        axios.get('http://localhost:8004/category').then(res=>{

            console.log('categories available:',res.data)
            this.setState({
                availcategory:res.data
            })

        })
    }


    togglevariant=()=>{
       
        this.setState({
            variantflag:!this.state.variantflag
        })
       
    }
   
    clearvariant=()=>{
      
        let b={
            quantity:this.state.newquantity,
            measurementUnit:this.state.newmeasurementUnit
        }
       
        this.setState({
            products:[...this.state.products,b],
            newmeasurementUnit:'',
            newquantity:0,
            variantflag:!this.state.variantflag    
        })
        

        document.getElementById('quantity').value=''
        document.getElementById('measurementunit').value=''
        
    }

    deletename=()=>{
        document.getElementById('productname').value=''
        this.setState({
            name:''
            
        })

    }
    deletedescription=()=>{
        document.getElementById('description').value=''
        this.setState({
            description:''
            
        })
    }

    deletehsn=()=>{
        document.getElementById('hsn').value=''
        this.setState({
            hsn:''
            
        })
    }
    deletemeasurementtype=()=>{
        document.getElementById('measurementtype').value=''
        this.setState({
            measurementType:''
            
        })
    }
    deletecategory=()=>{
        document.getElementById('category').value=''
        this.setState({
            category:''
            
        })
    }
    deletevariant(ind){
        let tempdel = this.state.products;
        tempdel.splice(ind, 1);
    this.setState({ products: tempdel });
    console.log(this.state.products)
    }

  /*
redirecttoaddproduct=(flag)=>{
    if(flag===false){
    this.setState({
        name:'',
        description:'',
        imgId:'',
        measurementType:'',
        products:[],
        availcategory:[],
            

       
        newquantity:0,
        newmeasurementUnit:'',
        variantflag:false,
        hsn:'',
        category:'',
        promptnewseller:0,
        check:false,
        redirectflag:false
    })
}


}*/

addimgtoggle=()=>{
    this.setState({
        imageflag:!this.state.imageflag,
        checkimg:false,
        pic:null
    })

}

onDrop(picture) {
    this.setState({
        pic: picture,
    });
}

onimgsubmit(e){
    e.preventDefault() 
    this.fileUpload(this.state.pic).then((response)=>{
        console.log('after postin',response.data);
         
        this.setState({
            imgId:response.data.id,
            pic:null,
            imageflag:!this.state.imageflag,
            checkimg:false,
        })
        console.log('alloted',this.state.checkimg)
    })
   

}
fileUpload(file){


    const formData = new FormData();
    formData.append('file',file)
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
     return post('http://localhost:8005/productimg', formData,config)
       
    
  }

  postproduct=()=>{

    const addprod={

        name: this.state.name,
        description:this.state.description,
        imageId: this.state.imgId,
        hsn:this.state.hsn,
        measurementType:this.state.measurementType,
        categoryId:this.state.category,
        products:this.state.products 
    
    }
    if(this.state.name && this.state.imgId && this.state.description && this.state.hsn && this.state.measurementType && this.state.category && this.state.products.length>0){

    axios.post('http://localhost:8006/addprod',addprod).then(res=>{
        console.log('posted',res.data)

        this.setState({
            name:'',
            description:'',
            imgId:'',
            measurementType:'',
            products:[],
                

           
            newquantity:0,
            newmeasurementUnit:'',
            variantflag:false,
            hsn:'',
            category:'',
            promptnewseller:0,
            check:false,
            imageflag:false,
            checkimg:false,
            pic:null
        })
        document.getElementById('category').value=''
        document.getElementById('hsn').value=''
        document.getElementById('description').value=''
        document.getElementById('productname').value=''
        document.getElementById('measurementtype').value=''
        document.getElementById('category').value=''

    })
    }
    else{
        alert('Fill all details')
    }
    
}


  

    render() {
        return (
            <Container>


            <div className="App">
                <center><h3>ADD PRODUCT</h3></center>
                <br></br>
                
                <Form>

                <FormGroup row>
                    <Label for="productname" sm={2}>PRODUCT NAME</Label>
                    <Col sm={5}>
                    <Input type="text"  id="productname" placeholder="Enter product name" onChange={(e)=>{
                        
                        this.setState({
                            name:e.target.value
                        })

                    }}/>
                    </Col>
                    <Col sm={1}>
                        <DeleteIcon onClick={this.deletename}/>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="description" sm={2}>DESCRIPTION</Label>
                    <Col sm={5}>
                    <Input type="textarea"  id="description" placeholder="Enter description if any" onChange={(e)=>{

                        this.setState({
                            description:e.target.value
                        })

                    }}/>
                    </Col>
                    <Col sm={1}>
                        <DeleteIcon onClick={this.deletedescription}/>
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label for="hsn" sm={2}>HSN</Label>
                    <Col sm={5}>
                    <Input type="text"  id="hsn" placeholder="Enter HSN" onChange={(e)=>{
                        
                        this.setState({
                            hsn:e.target.value
                        })

                    }}/>
                    </Col>
                    <Col sm={1}>
                        <DeleteIcon onClick={this.deletehsn}/>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="measurementtype" sm={2}>MEASUREMENT TYPE</Label>
                    <Col sm={4}>
                    <select id="measurementtype" onChange={(e)=>{this.setState({measurementType:e.target.value})}}> 
                        <option></option>
                        <option value="WEIGHT">WEIGHT</option>
                        <option value="VOLUME">VOLUME</option>
                        <option value="UNIT">UNIT</option>
                    </select>

                    </Col>
                 
                </FormGroup>

                <FormGroup row>
                <Label for="category" sm={2}>CATEGORY</Label>
                <Col sm={2}>
                        
                       
                    <select id="category" onChange={(e)=>this.setState({category:e.target.value})}> 
                            <option></option>
                        {this.state.availcategory.map((c,ind)=>{
                            return(
                             
                             <option value={c.id}>{c.name}</option>
                        )})}
                       
                    </select>

                    </Col>

                   <Col sm={4}>
                    <Button color="primary" >ADD NEW CATEGORY</Button>
                    </Col>
                    
        


                </FormGroup>  

                <FormGroup row>
                <Label for="buyquantity" sm={2}>VARIANT</Label>
                <Col sm={3}>
                    <Button color="primary" onClick={this.togglevariant}>ADD VARIANT</Button>
                </Col>
                
                </FormGroup>
                <FormGroup row>
                <Label for="addimg" sm={2}>ADD IMAGE</Label>
                <Col sm={3}>
                    <Button color="primary" onClick={this.addimgtoggle}>UPLOAD IMAGE</Button>
                </Col>
                
                </FormGroup>


                
                </Form>
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
 
                    <Row><Col sm={8}>IMAGE ID: {this.state.imgId} {this.state.imgId?(<h5> {' '} Image added Successfully!</h5>):(<></>)}</Col></Row>
                    
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
                                        
                                        <td><DeleteIcon onClick={()=>this.deletevariant(index)}/>{' '}</td> 
                                       
                                        </tr>


                                    )


                                }



                                )):(<></>)}
                            </tbody>
                        
                    </Table>
                    </Col>
                    </Row>
                    </CardBody>
                    <CardFooter>
                    <Row>
                        <Col>
                            <Input type="checkbox" onClick={()=>{this.setState({check:!this.state.check})}}/>{' '}
                            CONFIRM PRODUCT DETAILS</Col>
                            <Col>
                        {this.state.check?(
                         <Row>
                         <Col
                          >
                         <Button color="success" onClick={this.postproduct}>
                           CONFIRM
                         </Button>
                         </Col>
                       </Row>
                        ):(<h1>{''}</h1>)}
                        </Col>
                    </Row>
                    </CardFooter>
                </Card>
                </Col>
                </Row>
            <br></br>
            



               <Modal isOpen={this.state.variantflag} toggle={this.togglevariant}>
                   <ModalHeader toggle={this.togglevariant}> 
                        ADD VARIANT
                   </ModalHeader>
                    <ModalBody>
                        <FormGroup row>
                        <Label for="quantity" sm={5}>QUANTITY</Label>
                    <Col sm={4}>
                    <Input type="text"  id="quantity" placeholder="Enter Quantity" onChange={(e)=>{

                        if(e.target.value===''){
                            this.setState({
                                newquantity:0
                            })
                        }
                        else{
                            this.setState({
                                newquantity:parseFloat(e.target.value)
                            })
                        }

                    }}/>
                    </Col>
                    </FormGroup>
                        
                    <FormGroup row>
                        <Label for="measurementunit" sm={5}>MEASUREMENT UNIT</Label>
                    <Col sm={4}>
                    <select id="measurementunit" onChange={(e)=>this.setState({newmeasurementUnit:e.target.value})}>
                    <option>...</option>
                    <option value="KILOGRAM">KILOGRAM</option>
                    <option value="GRAM">GRAM</option>
                    <option value="LITRE">LITRE</option>
                    <option value="MILLILITRE">MILLILITRE</option>
                    <option value="UNIT">UNIT</option>
                    </select>
                    </Col>
                        </FormGroup>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.clearvariant}>ADD</Button>
                        <Button color="danger" onClick={this.togglevariant}>CANCEL</Button>
                    </ModalFooter>
               </Modal>
            
                <Modal size="lg" isOpen={this.state.imageflag} toggle={this.addimgtoggle}>
                    <ModalHeader toggle={this.addimgtoggle}>
                        UPLOAD IMAGE
                    </ModalHeader>
                    <ModalBody>

                    <ImageUploader
                withIcon={false}
                buttonText='Choose image'
                onChange={this.onDrop}
                imgExtension={['.jpg','.png','.jpeg']}
                maxFileSize={5242880}
                withPreview={true}
                />

                    <Row>
                       <Col sm={4}>
                        <Label for="imgcheckbox">CONFIRM UPLOAD</Label>
                        </Col>
                        <Col sm={1}>
                        <Input type="checkbox" onClick={()=>{this.setState({checkimg:!this.state.checkimg})}}/>{' '}
                           
                       

                        </Col>
                    </Row>
                        
                    </ModalBody>
                    
                    
                       
                    
                      <ModalFooter> 
                      {this.state.checkimg?(
                        
                          
                        <Button color="success" onClick={this.onimgsubmit}>UPLOAD</Button>
                      
                       ):(<h1>{''}</h1>)}
                      
                     
                        <Button color="danger" onClick={this.addimgtoggle}>CLOSE</Button>   

                    </ModalFooter>

                </Modal>
            
            </div>


            </Container>
            
        )
    }
}

export default Addproduct
