pragma solidity ^0.4.0;

import {owned} from "./owned.sol";


contract mortal is owned {
    function kill() public onlyowner {
        selfdestruct(msg.sender);
    }
}
