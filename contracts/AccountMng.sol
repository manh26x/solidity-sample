pragma solidity >=0.4.0 <0.9.0;
import "hardhat/console.sol";

contract AccountMng {

    struct Account {
        address id;
        string  name;
        uint256 birthdate;
        string email;
        string description;
    }

    Account[] public  accounts ;
    mapping(address => uint)  keyMap;

    constructor() {
    }

    function checkAccountExist(address _id) public view  returns (bool) {
        console.log("keyMap ", keyMap[_id]);
        if(accounts.length == 1) {
            console.log("accounts[0] ", accounts[0].id);
            return accounts[0].id != _id;
        }
        return keyMap[_id] != 0;
    }
    function registerAccount(address _id, string memory _name) external payable   {
        console.log("address ", _id);
        require(!this.checkAccountExist(_id), "account existed") ;
        keyMap[_id] = accounts.length;
        accounts.push(Account(_id, _name, 0, "", ""));
        assert(keccak256(abi.encodePacked(accounts[keyMap[_id]].name)) == keccak256(abi.encodePacked(_name)));
        console.log("accounts length ", accounts.length);
        console.log( "balance of " ,  accounts[keyMap[_id]].name," is " , address(_id).balance);
    }

    function getName(address _id) public view returns (string memory) {
        console.log("address ", _id);
        console.log("keyMap ", keyMap[_id]);
        console.log("accounts length ", accounts.length);
        require(this.checkAccountExist(_id), "account not existed") ;
        return accounts[keyMap[_id]].name;
    }

    function setName(address _id, string memory _name) public {
        require(this.checkAccountExist(_id), "account not existed") ;
        accounts[keyMap[_id]].name = _name;
    }

    function setDescription(string memory _description) public {
        require(this.checkAccountExist(msg.sender), "account not existed") ;
        accounts[keyMap[msg.sender]].description = _description;
    }
    function getDescription() public view returns (string memory) {
        require(this.checkAccountExist(msg.sender), "account not existed") ;
        return accounts[keyMap[msg.sender]].description;
    }

    function setBirthdate(uint256 _birthdate) public {
        console.log("keyMap :", msg.sender, " is " , keyMap[msg.sender]);
        console.log("accounts.length", accounts.length);
        require(this.checkAccountExist(msg.sender), "account not existed") ;
        accounts[keyMap[msg.sender]].birthdate = _birthdate;
    }
    function getBirthdate() public view returns (uint) {
        require(this.checkAccountExist(msg.sender), "account not existed") ;
        return accounts[keyMap[msg.sender]].birthdate;
    }
}
