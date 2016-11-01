pragma solidity ^0.4.0;


library SafeMathLib {
    /*
     * Subtracts b from a.  Throws and exception when underflow contitions are
     * met.
     */
    function safeSubtract(uint a, uint b) returns (uint) {
        if (b > a) {
            throw;
        } else {
            return a - b;
        }
    }

    /*
     * Adds b to a. Throws an exception when overflow conditions are met.
     */
    function safeAdd(uint a, uint b) returns (uint) {
        if (a + b >= a) {
            return a + b;
        } else {
            throw;
        }
    }

    /*
     * Multiplies a by b. Throws an exception when overflow conditions are met.
     */
    function safeMultiply(uint a, uint b) returns (uint) {
        var result = a * b;
        if (b == 0 || result / b == a) {
            return a * b;
        } else {
            throw;
        }
    }
}
