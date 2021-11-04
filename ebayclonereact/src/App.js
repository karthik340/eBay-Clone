import React,{Component} from 'react';
import Web3 from 'web3';
import {Navbar,Modal,Button,ListGroup,ListGroupItem} from 'react-bootstrap';
import './App.css';
import { Form } from 'react-bootstrap';
import {Container} from 'react-bootstrap';
class App extends Component {

  web3;
  eBayClone;

  constructor(props,context){

    super(props,context);
    this.start();

    const address = '0x2A156450647827bF931b0517eb4C6E25C9B398f7';
    const abi = [
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_id",
            "type": "uint256"
          }
        ],
        "name": "buyProduct",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getNumberOfProducts",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "products",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "seller",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "buyer",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_description",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "_price",
            "type": "uint256"
          }
        ],
        "name": "sellProduct",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];
    this.eBayClone = new this.web3.eth.Contract(abi,address);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleProductNameChange = this.handleProductNameChange.bind(this)
    this.handleProductPriceChange = this.handleProductPriceChange.bind(this)
    this.handleProductDescChange = this.handleProductDescChange.bind(this)
  }

  state = {
    user:'',
    balance:'',
    show: false,
    productName:'',
    productPrice:'',
    productDescription:'',
    message:'',
    products:[]
  }

  handleClose(){
    this.setState({
      show:false
    })
  }

  handleProductNameChange(e){
    this.setState({
      productName:e.target.value
    });
  }

  handleProductPriceChange(e){
    this.setState({
      productPrice:e.target.value
    })
  }

  handleProductDescChange(e){
    this.setState({
      productDescription:e.target.value
    })
  }

  handleShow(e){
    this.setState({
      show:true,
      productName:'',
      productPrice:'',
      productDescription:''
    })
  }

  handleSell = async(event) => {
    event.preventDefault();
    this.setState({message: "waiting on sell transaction status..."});
    this.handleClose();
    await this.eBayClone.methods.
    sellProduct(this.state.productName,this.state.productDescription,this.web3.utils.toWei(this.state.productPrice,'ether')).
    send({from:this.state.user,gas:500000});
    await this.refreshContractDetails();
    this.setState({message:"sell transaction entered"});
  } 

  async start() {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      this.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }
  async refreshContractDetails(){
    const accounts = await this.web3.eth.getAccounts();
    const user = accounts[0];
   // console.log('hey ',user)
    const balance = this.web3.utils.fromWei(await this.web3.eth.getBalance(user),'ether')
    const productsCount = await this.eBayClone.methods.getNumberOfProducts().call()
    const products = await Promise.all(
      Array(parseInt(productsCount))
      .fill()
      .map((element,index) => {
        return this.eBayClone.methods.products(index).call();
      })
    );
    this.setState({
      user:user,
      balance:balance,
      products:products
    })
    }

renderProducts(){
  return this.state.products.map((product,index)=>{
    var price=this.web3.utils.fromWei(product.price,'ether');
    return(
      <ListGroup>
        <ListGroupItem header={product.name}>Description {product.description}</ListGroupItem>
        <ListGroupItem>Price (ETH) {price}</ListGroupItem>
        <ListGroupItem>Sold By {product.seller}</ListGroupItem>
        <ListGroupItem>Bought by {product.buyer}</ListGroupItem>
      </ListGroup>
    );
  });
}

  componentDidMount(){
    this.refreshContractDetails();
  }
  render() {
    return (
      <div className="App">
        <h1>{this.state.message}</h1>
      <Navbar>
      <Container>
        <Navbar.Brand href="#home">eBay Clone</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          
          <Navbar.Text>
            Signed in as: <a href="#">{this.state.user}</a>
          </Navbar.Text>
          <Navbar.Text>
            Balance : {this.state.balance}
          </Navbar.Text>
          <Navbar.Text>
            <Button onClick={this.handleShow}>Sell a product</Button>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <Modal show={this.state.show} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sell a Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
            <Form.Group  controlId="formBasicText">
              <Form.Label>Product Name</Form.Label>
              <Form.Control type="text" placeholder="Enter your Product Name" value={this.state.productName} onChange={this.handleProductNameChange}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Price in ETH</Form.Label>
              <Form.Control type="number" placeholder="1" value={this.state.productPrice} onChange={this.handleProductPriceChange}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" placeholder="Describe your product" value={this.state.productDescription} onChange={this.handleProductDescChange}/>
            </Form.Group>
            
        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleClose}>Close</Button>
          <Button onClick={this.handleSell}>Sell</Button>
        </Modal.Footer>
      </Modal>
      {this.renderProducts()}
    </div>
    )
  };
}

export default App;
