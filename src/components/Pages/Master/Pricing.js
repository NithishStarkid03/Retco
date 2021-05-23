import axios from 'axios';
import React, { Component } from 'react'
import { Card, Container,Modal,ModalBody,ModalFooter,ModalHeader,Table ,Row,Col,Label,Input} from 'reactstrap';
import { Button, CardBody, CardTitle } from 'reactstrap';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

class Pricing extends Component {

    constructor(props){
        super(props);
        this.state={
            pricingproducts:[],
            isopen:false,
            wastage:0,
            profitmargin:0,
            taxslab:0,
            mrp:0,
            displayname:'',
            procprodid:0,
            nwastage:0,
            nprofitmargin:0,
            ntaxslab:0,
            nmrp:0,
            wastageflag:0,
            prodstock:0,
            addpricetableflag:false,
            originaltaxslab:0,
            vardet:[],
            packingcost:[],
            iseditopen:false,
            packcostforedit:[]

        }
        this.packcost=this.packcost.bind(this)
    }

    componentDidMount(){
        this.getproducts()

    }

    getproducts(){
        axios.get('http://localhost:8009/price').then(res=>{
            console.log('recieved procured products',res.data)
            this.setState({
                pricingproducts:res.data
            })
        })
    }

    openmodal(id,name,stock,tax,variants){
        this.setState({
            isopen:!this.state.isopen,
            displayname:name,
            procprodid:id,
            prodstock:stock,
            originaltaxslab:tax,
            ntaxslab:tax,
            vardet:variants
        })

    }

    togglepricemodal=()=>{
        this.setState({isopen:false})
    }

    toggleeditpricemodal=()=>{
        this.setState({iseditopen:false})
    }
    editpricing=()=>{
        this.setState({
            iseditopen:true,
            wastageflag:(this.state.nwastage/100)*this.state.prodstock
        })
    }

    packcost(ind,id,event){
        let val=[...this.state.packingcost]
        val[ind]={productId:id,cost:parseFloat(event.target.value)}
        let temp=[...this.state.packcostforedit]
        temp[ind]=parseFloat(event.target.value)

        this.setState({
            packingcost:val,
            packcostforedit:temp

        })
console.log('pc',this.state.packingcost,this.state.packcostforedit)
    }

    addprice(){
        this.setState({
            wastage:this.state.nwastage,
            profitmargin:this.state.nprofitmargin,
            mrp:this.state.nmrp,
            taxslab:this.state.ntaxslab,
            isopen:false,
            addpricetableflag:true
        })
        console.log( 'added',this.state.wastage,this.state.profitmargin,this.state.mrp, this.state.taxslab)
    }

    editprice(){
        this.setState({
            wastage:this.state.nwastage,
            profitmargin:this.state.nprofitmargin,
            mrp:this.state.nmrp,
            taxslab:this.state.ntaxslab,
            iseditopen:false,
            addpricetableflag:true
        })

    }
    deleteprice(){
        this.setState({
            isopen:false,
            wastage:0,
            profitmargin:0,
            taxslab:0,
            mrp:0,
            displayname:'',
            procprodid:0,
            nwastage:0,
            nprofitmargin:0,
            ntaxslab:0,
            nmrp:0,
            wastageflag:0,
            prodstock:0,
            addpricetableflag:false,
            originaltaxslab:0,
            vardet:[],
            packingcost:[],
            iseditopen:false,
            packcostforedit:[]
        })

    }

    postpricing=()=>{
        const postprice={
            wastage:this.state.wastage,
            profitMargin:this.state.profitmargin,
            taxSlab:this.state.taxSlab,
            mrp:this.state.mrp,
            procuredProductId:this.state.procprodid,
            packingCosts:this.state.packingcost
        }
        axios.post('http://localhost:8008/pricepost',postprice).then(res=>{
            console.log(res.data)

            this.setState({
            isopen:false,
            wastage:0,
            profitmargin:0,
            taxslab:0,
            mrp:0,
            displayname:'',
            procprodid:0,
            nwastage:0,
            nprofitmargin:0,
            ntaxslab:0,
            nmrp:0,
            wastageflag:0,
            prodstock:0,
            addpricetableflag:false,
            originaltaxslab:0,
            vardet:[],
            packingcost:[],
            iseditopen:false,
            packcostforedit:[]

            })
        })
    }

    render() {

        let pricingdata=this.state.pricingproducts.map((pr,ind)=>{
            return(
                <tr key={ind}>
                    <td>{ind+1}</td>
                    <td>{pr.batchCode}</td>
                    <td>{pr.productGroupName}</td>
                    <td>{pr.stock}</td>
                    <td>{pr.unit}</td>
                    <td>{pr.tax}</td>
                   <td> {pr.products.map((v,i)=>{
                       return(
                        <ul>
                           <li> {v.quantity}{' '}{v.unit}</li>
                        </ul>    
                        
                        )
                    })}</td>
                    <td><Button color="primary" onClick={()=>this.openmodal(pr.procuredProductId,pr.productGroupName,pr.stock,pr.tax,pr.products)}>ADD</Button></td>
                </tr>
            )

        })

        return (
            <Container>
                <div className="App">
                <center><h3>PRICING</h3></center>
                
                {this.state.addpricetableflag?(
                   <Card>
                       <center><b>PRICING STATUS</b></center>
                       <CardBody>
                       <CardTitle>PRODUCT  NAME: <b>{this.state.displayname}</b></CardTitle>
                        
                       <Table size="sm">
                           <thead>
                               <tr>
                                   <th>WASTAGE %</th>
                                   <th>TAX SLAB %</th>
                                   <th>PROFIT MARGIN %</th>
                                   <th>MRP %</th>
                                   <th>PACKING COST</th>
                                   <th></th>
                               </tr>
                            </thead> 
                            <tbody>
                                <tr>
                                    <td>{this.state.wastage}</td>
                                    <td>{this.state.taxslab}</td>
                                    <td>{this.state.profitmargin}</td>
                                    <td>{this.state.mrp}</td>
                                    <td>
                                        {
                                        this.state.packingcost.map((pc,i)=>{
                                            return(
                                                <div>
                                                    {pc.productId}:Rs.{pc.cost}
                                                </div>
                                                

                                            )
                                        })}
                                    </td>
                                    <td><EditIcon onClick={this.editpricing}/>{' '}<DeleteIcon onClick={()=>this.deleteprice()}/></td>
                                </tr>
                            </tbody>
                           
                        </Table>                                                                                       
                        <center><Button color="success" onClick={this.postpricing}>ADD</Button></center>
                       </CardBody>
                      
                   </Card>


                ):(<></>)}
                
                
                
                <Table striped>
                    <thead>
                        <tr>
                            <th>SNo</th>
                            <th>BATCH CODE</th>
                            <th>PRODUCT NAME</th>
                            <th>STOCK</th>
                            <th>MEASUREMENT UNIT</th>
                            <th>TAX</th>
                            <th>VARIANTS</th>
                            <th>ADD PRICING</th>
                        </tr>
                    </thead>
                    <tbody>
                            {pricingdata}
                    </tbody>

                </Table>

                <Modal  isOpen={this.state.isopen} toggle={this.togglepricemodal}>
                    <ModalHeader toggle={this.togglepricemodal}>
                        ADD PRICING
                    </ModalHeader>
                    <ModalBody>
                        <Card>
                            <CardBody>
                                <Row><Col>PRODUCT NAME: <b>{this.state.displayname}</b></Col></Row>
                                <br></br>
                                <CardTitle>WASTAGE:</CardTitle>
                                <Row>
                                
                                <Col sm={6}>
                                <Label for="wastageper">PERCENTAGE</Label>
                                </Col>
                                <Col sm={6}>
                                <Label for="wastageamt">UNIT</Label>
                                </Col>
                                </Row>
                                <Row>
                                <Col>
                                    <Input type="text" id="wastageper" placeholder={this.state.wastageflag+'%'} onChange={(e)=>{
                                        if(e.target.value===''){
                                            this.setState({
                                                nwastage:0,
                                                wastageflag:0
                                            })
                                        }
                                        else{
                                            let unit=(parseFloat(e.target.value)/100)*this.state.prodstock
                                            this.setState({
                                               wastageflag:unit,
                                                nwastage:parseFloat(e.target.value)
                                            })
                                        }
                                    }}/>
                                    </Col>
                                    <Col>
                                    <Input type="text" id="wastageamt" placeholder={this.state.wastageflag} onChange={(e)=>{
                                        if(e.target.value===''){
                                            this.setState({
                                                nwastage:0,
                                                wastageflag:0
                                            })
                                        }
                                        else{
                                            let per=(parseFloat(e.target.value)*100)/this.state.prodstock
                                            this.setState({
                                               wastageflag:per,
                                                nwastage:per
                                            })
                                        }
                                    }}/>
                                    </Col>
                                   
                                </Row>

                                <Row><Col>
                                <Label for="profitmargin">PROFIT MARGIN</Label>
                                </Col></Row>
                                <Row>
                                    <Col>
                                    <Input type="text" id="profitmargin" placeholder="%" onChange={(e)=>{
                                        if(e.target.value===''){
                                                this.setState({
                                                    nprofitmargin:0
                                                })
                                        }
                                        else{
                                            this.setState({
                                                nprofitmargin:parseFloat(e.target.value)
                                            })
                                        }
                                    }
                                    }/>
                                    </Col>
                                </Row>

                                <Row><Col>
                                <Label for="taxslab">TAX SLAB</Label>
                                </Col></Row>
                                <Row>
                                    <Col>
                                    <Input type="text" id="taxslab" placeholder={this.state.originaltaxslab+'%'} onChange={(e)=>{
                                        if(e.target.value===''){
                                                this.setState({
                                                    ntaxslab:this.state.originaltaxslab
                                                })
                                        }
                                        else{
                                            this.setState({
                                                ntaxslab:parseFloat(e.target.value)
                                            })
                                        }
                                    }
                                    }/>
                                    </Col>
                                </Row>

                                <Row><Col>
                                <Label for="mrp">MRP</Label>
                                </Col></Row>
                                <Row>
                                    <Col>
                                    <Input type="text" id="mrp" placeholder="%" onChange={(e)=>{
                                        if(e.target.value===''){
                                                this.setState({
                                                    nmrp:0
                                                })
                                        }
                                        else{
                                            this.setState({
                                                nmrp:parseFloat(e.target.value)
                                            })
                                        }
                                    }
                                    }/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                    <Label for="packingcost">PACKING COST</Label>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                    {
                                    this.state.vardet.map((va,ind)=>{
                                    let b={}
                                    return(
                                        <>
                                     <Label>{va.quantity}{' '}{va.unit}</Label>       
                                    <Input type="text" onChange={this.packcost.bind(this,ind,va.id)}/>
                                        <br></br>  
                                        </>
                                        )
                                        })
                                    }
                                    </Col>
                                </Row>
                               
                            </CardBody>
                        </Card>
                    </ModalBody>
                    <ModalFooter>
                    <Button color="success" size="sm" onClick={this.addprice.bind(this)}>ADD</Button>
                    <Button color="danger" size="sm" onClick={this.togglepricemodal}>CANCEL</Button>

                    </ModalFooter>
                </Modal>



                <Modal  isOpen={this.state.iseditopen} toggle={this.toggleeditpricemodal}>
                    <ModalHeader toggle={this.toggleeditpricemodal}>
                        EDIT PRICING
                    </ModalHeader>
                    <ModalBody>
                        <Card>
                            <CardBody>
                                <Row><Col>PRODUCT NAME: <b>{this.state.displayname}</b></Col></Row>
                                <br></br>
                                <CardTitle>WASTAGE:</CardTitle>
                                <Row>
                                
                                <Col sm={6}>
                                <Label for="wastageper">PERCENTAGE</Label>
                                </Col>
                                <Col sm={6}>
                                <Label for="wastageamt">UNIT</Label>
                                </Col>
                                </Row>
                                <Row>
                                <Col>
                                    <Input type="text" id="wastageper" value={this.state.nwastage} onChange={(e)=>{
                                        if(e.target.value===''){
                                            this.setState({
                                                nwastage:0,
                                                wastageflag:0
                                            })
                                        }
                                        else{
                                            let unit=(parseFloat(e.target.value)/100)*this.state.prodstock
                                            this.setState({
                                               wastageflag:unit,
                                                nwastage:parseFloat(e.target.value)
                                            })
                                        }
                                    }}/>
                                    </Col>
                                    <Col>
                                    <Input type="text" id="wastageamt" value={this.state.wastageflag} onChange={(e)=>{
                                        if(e.target.value===''){
                                            this.setState({
                                                nwastage:0,
                                                wastageflag:0
                                            })
                                        }
                                        else{
                                            let per=(parseFloat(e.target.value)*100)/this.state.prodstock
                                            this.setState({
                                               wastageflag:per,
                                                nwastage:per
                                            })
                                        }
                                    }}/>
                                    </Col>
                                   
                                </Row>

                                <Row><Col>
                                <Label for="profitmargin">PROFIT MARGIN</Label>
                                </Col></Row>
                                <Row>
                                    <Col>
                                    <Input type="text" id="profitmargin" value={this.state.nprofitmargin} placeholder="%" onChange={(e)=>{
                                        if(e.target.value===''){
                                                this.setState({
                                                    nprofitmargin:0
                                                })
                                        }
                                        else{
                                            this.setState({
                                                nprofitmargin:parseFloat(e.target.value)
                                            })
                                        }
                                    }
                                    }/>
                                    </Col>
                                </Row>

                                <Row><Col>
                                <Label for="taxslab">TAX SLAB</Label>
                                </Col></Row>
                                <Row>
                                    <Col>
                                    <Input type="text" id="taxslab" value={this.state.ntaxslab} onChange={(e)=>{
                                        if(e.target.value===''){
                                                this.setState({
                                                    ntaxslab:this.state.originaltaxslab
                                                })
                                        }
                                        else{
                                            this.setState({
                                                ntaxslab:parseFloat(e.target.value)
                                            })
                                        }
                                    }
                                    }/>
                                    </Col>
                                </Row>

                                <Row><Col>
                                <Label for="mrp">MRP</Label>
                                </Col></Row>
                                <Row>
                                    <Col>
                                    <Input type="text" id="mrp" placeholder="%" value={this.state.nmrp} onChange={(e)=>{
                                        if(e.target.value===''){
                                                this.setState({
                                                    nmrp:0
                                                })
                                        }
                                        else{
                                            this.setState({
                                                nmrp:parseFloat(e.target.value)
                                            })
                                        }
                                    }
                                    }/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                    <Label for="packingcost">PACKING COST</Label>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                    {
                                    this.state.vardet.map((va,ind)=>{
                                    let b={}
                                    return(
                                        <>
                                     <Label>{va.quantity}{' '}{va.unit}</Label>       
                                    <Input type="text" placeholder={this.state.packcostforedit[ind]} onChange={this.packcost.bind(this,ind,va.id)}/>
                                        <br></br>  
                                        </>
                                        )
                                        })
                                    }
                                    </Col>
                                </Row>
                               
                            </CardBody>
                        </Card>
                    </ModalBody>
                    <ModalFooter>
                    <Button color="success" size="sm" onClick={this.editprice.bind(this)}>EDIT</Button>
                    <Button color="danger" size="sm" onClick={this.toggleeditpricemodal}>CANCEL</Button>

                    </ModalFooter>
                </Modal>
   



                </div>
            </Container>
            
        )
    }
}

export default Pricing
