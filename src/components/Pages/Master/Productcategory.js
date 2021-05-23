import React, { Component } from 'react'
import {CardFooter, Col, Container,FormGroup,Label,ModalFooter,ModalHeader,Row, Table} from 'reactstrap'
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button ,Modal, ModalBody,Input} from 'reactstrap';
import axios,{post} from 'axios';
import ImageUploader from 'react-images-upload';


class Productcategory extends Component {
    constructor(props){
        super(props)
        this.state={
            product:this.props.location.prod,
            catname:this.props.location.name,
            catid:this.props.location.id,
            editmodal:false,
            ename:'',
            edescription:'',
            ehsn:'',
            eproducts:[],
            estatus:false,
            ecatid:0,
            eprdid:0,
            
            imageflag:false,
            checkimg:false,
            pic:null,
            eimgId:'',

            newvariantmodal:false,
            editvariantmodal:false,
            baseurl:'http://retco-server.us-east-1.elasticbeanstalk.com/api',
            newvarquantity:0,
            newvarmeasurementUnit:''




            

        }
        console.log(this.props.location.prod)
        this.onDrop = this.onDrop.bind(this);
        this.onimgsubmit = this.onimgsubmit.bind(this)
        this.fileUpload = this.fileUpload.bind(this)
        
    }
    
  editprod(name,description,hsn,products,status,catid,imgId,prdid)
  {
    this.setState({
        editmodal:!this.state.editmodal,
        ename:name,
        edescription:description,
        ehsn:hsn,
        eproducts:products,
        estatus:status,
        ecatid:catid,
        eimgId:imgId,
        eprdid:prdid
    })
  }
       
  closeeditmodal=()=>{
      this.setState({
        editmodal:!this.state.editmodal,
        ename:'',
        edescription:'',
        ehsn:'',
        eproducts:[],
        estatus:false,
        ecatid:'',
        eprdid:0    
      })
   
  }
    
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
            eimgId:response.data.id,
            pic:null,
            imageflag:!this.state.imageflag,
            checkimg:false,
        })
        console.log('alloted',this.state.checkimg)
    })
   

}

fileUpload(file){

console.log('ran',file)
    const formData = new FormData();
    formData.append('image',file[0])
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
     return post(' http://retco-server.us-east-1.elasticbeanstalk.com/api/uploadImage', formData,config)
       
    
  }
updateprod(){
    const prod={
        categoryId: this.state.ecatid,
        description: this.state.edescription,
        hsn: this.state.ehsn,
        imageId:this.state.eimgId,
        position:null,
        status: this.state.estatus
    }
    axios.put(`${this.state.baseurl}/product/productGroup/update/${this.state.eprdid}`,prod).then(res=>{
        console.log('updated',res.data)
        this.setState({
            editmodal:false,
            ename:'',
            edescription:'',
            ehsn:'',
            eproducts:[],
            estatus:false,
            ecatid:0,
            eprdid:0,
            
            imageflag:false,
            checkimg:false,
            pic:null,
            eimgId:''

        })
    })
}

      

addnewvariant=()=>{
    this.setState({
        newvariantmodal:!this.state.newvariantmodal
    })
}


    


postnewvariant=()=>{
    const postnewvariant={
        quantity:this.state.newvarquantity,
        measurementUnit:this.state.newvarmeasurementUnit
    }
    axios.post(`${this.state.baseurl}/product/add`,postnewvariant).then(res=>{
        console.log('new variant added',res.data)

        this.setState({
            newvariantmodal:false,
            newvarquantity:0,
            newvarmeasurementUnit:''


        })
    
        document.getElementById('quantity').value=''
        document.getElementById('measurementunit').value=''
    
    
    })
}

updatevariant(varid,status){
    axios.put(`${this.state.baseurl}/product/updateStatus/${varid}`).then(res=>{
        console.log('variantstatusupdated',res.data)
    })
}

    render() {



        let productdisplay=this.state.product.map((cat)=>{
            return(
                <>
                
                
              {cat.productGroups.map((pr,ind)=>{
            let url=`${this.state.baseurl}/image/${pr.imageId}`
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
                        <Button color="primary" size="sm" onClick={()=>this.editprod(pr.name,pr.description,pr.hsn,pr.products,pr.status,this.state.catid,pr.imageId,pr.id)}>EDIT</Button>{' '}
                        <Button color="primary" size="sm" onClick={this.addnewvariant}>ADD VARIANT</Button>{' '}
                           
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
                
                <Modal isOpen={this.state.editmodal} toggle={this.closeeditmodal}>
                    <ModalHeader toggle={this.closeeditmodal}>
                    EDIT {this.state.ename}
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup row>
                        <Label sm={5}>Category ID : {this.state.ecatid}</Label>
                       
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={3}>DESCRIPTION</Label>
                            <Col sm={4}>
                            <Input id="editdescription" type="textarea" value={this.state.edescription} onChange={(e)=>{
                                this.setState({
                                    edescription:e.target.value
                                })
                            }}/>
                            </Col>
                           
                        </FormGroup>
                        <FormGroup row>
                        <Label sm={3}>HSN</Label>
                        <Col sm={4}>
                        <Input id="editdescription" value={this.state.ehsn} onChange={(e)=>{
                                this.setState({
                                    ehsn:e.target.value
                                })
                            }}/> 
                        </Col>
                           
                           
                        </FormGroup>
                        <FormGroup row>
                        <Label for="addimg" sm={3}>EDIT IMAGE</Label>
                        <Col sm={4}>
                        <Button color="primary" size="sm" onClick={this.addimgtoggle}>UPLOAD IMAGE</Button>
                         </Col>
                        </FormGroup>

                        <FormGroup row>
                        <Label sm={3}>STATUS</Label>
                        <Col sm={4}>
                        <select id="editstatus" onChange={(e)=>this.setState({estatus:e.target.value})}>
                            {this.state.estatus===true?( <option value="" selected disabled>ENABLE</option>):(<option  value="" selected disabled>DISABLE</option>)}
                           
                            <option value={true}>ENABLE</option>
                            <option value={false}>DISABLE</option>
                            </select>   
                        </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={3}>VARIANT</Label>
                            <Col sm={8}>
                            <Button color="secondary" size="sm" onClick={()=>this.setState({editvariantmodal:!this.state.editvariantmodal})}>EDIT VARIANT</Button>
                            </Col>
                            
                            
                        </FormGroup>
                           
                        

                    </ModalBody>
                    <ModalFooter>
                    <Button color="danger" onClick={this.closeeditmodal}>CLOSE</Button>
                    <Button color="success" onClick={()=>this.updateprod()}>EDIT</Button>
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


                <Modal isOpen={this.state.newvariantmodal} toggle={()=>this.setState({newvariantmodal:false})}>
                    <ModalHeader toggle={()=>this.setState({newvariantmodal:false})}>
                        ADD VARIANT
                    </ModalHeader>
                    <ModalBody>
                    <FormGroup row>
                        <Label for="quantity" sm={5}>QUANTITY</Label>
                    <Col sm={4}>
                    <Input type="text"  id="quantity" placeholder="Enter Quantity" onChange={(e)=>{

                        if(e.target.value===''){
                            this.setState({
                                newvarquantity:0
                            })
                        }
                        else{
                            this.setState({
                                newvarquantity:parseFloat(e.target.value)
                            })
                        }

                    }}/>
                    </Col>
                    </FormGroup>
                        
                    <FormGroup row>
                        <Label for="measurementunit" sm={5}>MEASUREMENT UNIT</Label>
                    <Col sm={4}>
                    <select id="measurementunit" onChange={(e)=>this.setState({newvarmeasurementUnit:e.target.value})}>
                    <option>...</option>
                    <option value="KILOGRAM">KILOGRAM</option>
                    <option value="GRAM">GRAM</option>
                    <option value="LITRE">LITRE</option>
                    <option value="MILLILITRE">MILLILITRE</option>
                    <option value="UNIT">UNIT</option>
                    </select>
                    </Col>
                    </FormGroup>
                    <Row>
                    <Col sm={12}><b>QUANTITY:</b>{this.state.newvarquantity}{' '}<b>MEASUREMENT UNIT</b>:{this.state.newvarmeasurementUnit}</Col>
                      
                    </Row>
                    
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={()=>this.setState({newvariantmodal:false})}>CANCEL</Button>
                        <Button color="success" onClick={this.postnewvariant}>CONFIRM</Button>
                    </ModalFooter>
                </Modal>


                    <Modal isOpen={this.state.editvariantmodal} toggle={()=>this.setState({editvariantmodal:false})}>
                        <ModalHeader toggle={()=>this.setState({editvariantmodal:false})}>EDIT VARIANT</ModalHeader>
                        <ModalBody>
                        <Table size="sm">
                            <thead>
                                <tr>
                                    <th>SNo</th>
                                    <th>Quantity</th>
                                    <th>Unit</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.eproducts.map((vr,ind)=>{
                                    return(
                                        <tr key={ind}>
                                            <td>{ind+1}</td>
                                            <td>{vr.quantity}</td>
                                            <td>{vr.measurementUnit}</td>
                                            <td>
                                                <select id="variantedit" onChange={(e)=>this.updatevariant(vr.id,e.target.value)}>
                                                {vr.status===true?(<option value="" selected disabled>ENABLE</option>):(<option  value="" selected disabled>DISABLE</option>)}
                                                <option value={true}>ENABLE</option>
                                                <option value={false}>DISABLE</option>
                                                </select>
                                            
                                            </td>
                                            
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" onClick={()=>this.setState({editvariantmodal:false})}>CLOSE</Button>
                            <Button color="success" onClick={()=>this.setState({editvariantmodal:false})}>EDIT</Button>
                        </ModalFooter>
                    </Modal>

            </Container>
            )
    }
}

export default Productcategory
