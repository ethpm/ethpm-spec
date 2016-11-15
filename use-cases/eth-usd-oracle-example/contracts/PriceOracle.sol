pragma solidity ^0.4.0;

contract PriceOracle {
    address owner;
    uint priceInCents;

    function PriceOracle() {
        owner = msg.sender;
    }

    function getPrice() constant returns (uint) {
        return priceInCents;
    }

    function setPrice(uint _priceInCents) public {
        if (msg.sender != owner) {
            throw;
        } else {
            priceInCents = _priceInCents;
        }
    }
}
