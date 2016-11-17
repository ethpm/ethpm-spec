pragma solidity ^0.4.0;

import "owned/owned";

contract PriceOracle is owned {
    uint priceInCents;

    function getPrice() constant returns (uint) {
        return priceInCents;
    }

    function setPrice(uint _priceInCents) onlyowner public {
        priceInCents = _priceInCents;
    }
}
