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

    function registerAccount(address _id, string memory _name) public  {
        console.log("address ", _id);
        console.log("keyMap ", keyMap[_id]);
        require(keyMap[_id] != 0 ||  accounts.length == 0, "account existed") ;
        keyMap[_id] = accounts.length;
        Account memory account = Account(_id, _name);
        accounts.push(account);
        console.log("accounts length ", accounts.length);
        console.log( "balance of " ,  accounts[keyMap[_id]].name," is " , address(_id).balance);
    }

    function getName(address _id) public view returns (string memory) {
        console.log("address ", _id);
        console.log("keyMap ", keyMap[_id]);
        console.log("accounts length ", accounts.length);
        require(keyMap[_id] != 0 || accounts.length == 1, "account not existed") ;
        return accounts[keyMap[_id]].name;
    }

    function setName(address _id, string memory _name) public {
        accounts[keyMap[_id]].name = _name;
    }
}
