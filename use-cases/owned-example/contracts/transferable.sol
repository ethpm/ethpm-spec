pragma solidity ^0.4.0;

import {owned} from "./owned.sol";


contract transferable is owned {
    event OwnerChanged(address indexed previousOwner, address indexed newOwner);

    function transferOwnership(address newOwner) public onlyowner {
        OwnerChanged(owner, newOwner);
        owner = newOwner;
    }
}
