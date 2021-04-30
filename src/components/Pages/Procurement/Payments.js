import React, { Component } from 'react'
import { Container, Row, Col,Form } from 'reactstrap';
import axios from 'axios';
import {Table} from 'reactstrap';

class Payments extends Component {

    constructor(props) {
        super(props);
        this.state={

            paydet:[]

        }
    }



    componentDidMount(){
        axios.get('http://localhost:3000/procurement_post').then((response)=>{



        })

    }

    render() {
        return (
           
             <Container>
            <h1>PAYMENTS</h1>
            <Table striped>
            <thead>
            <td></td>    
            </thead>    
                
            </Table>


            </Container>
          
        )
    }
}

export default Payments
