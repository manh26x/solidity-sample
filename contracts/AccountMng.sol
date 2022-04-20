pragma solidity ^0.8.0;
import "hardhat/console.sol";
contract AccountMng {

    struct Account {
        address id;
        string  name;
    }

    mapping(address => Account) private accounts;

    constructor() {

    }

    function registerAccount(address _id, string memory _name) public  {
        console.log(string(abi.encodePacked(msg.sender)));
        require(accounts[msg.sender].id == address(0) , "account existed") ;
        accounts[msg.sender] = Account(msg.sender, _name);
        console.log( string(abi.encodePacked("balance of " , msg.sender," is " , address(msg.sender).balance)));
    }

    function getName() public view returns (string memory) {
        console.log(string(abi.encodePacked("getName from " , msg.sender)));
        return accounts[msg.sender].name;
    }

    function setName(string memory _name) public {
        accounts[msg.sender].name = _name;
    }
}
