# EVM Smart Contract Packaging Specification

[![Join the chat at https://gitter.im/ethpm/Lobby](https://badges.gitter.im/ethpm/Lobby.svg)](https://gitter.im/ethpm/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Ethereum Packaging Specification


## Specifications

* [Package Manifest](./package-manifest-spec.md)
* [Release Lock File](./release-lock-file-spec.md)


## Definitions

The following *types* are used within this specification.


### Contract Name

A string matching the regular expression `[_a-zA-Z][_a-zA-Z0-9]*`


### Package Name

A string matching the regular expression `[a-zA-Z][-_a-zA-Z0-9]*`


### IPFS URI

An URI in the format `ipfs://<multihash>[/<path>]`


### Chain Definition via BIP122 URI

An URI in the format `blockchain://<chain_id>/block/<block_hash>`

* `chain_id` is the unprefixed genesis hash for the chain.
* `block_hash` is the hash of a block on the chain.

A chain is considered to match a chain definition if the the genesis block hash
matches the `chain_id` and the block defined by `block_hash` can be found on
that chain.  It is possible for multiple chains to match a single URI, in which
case all chains are considered valid matches


## Resources

* https://pad.riseup.net/p/7x3G896a3NLA
* https://medium.com/@sdboyer/so-you-want-to-write-a-package-manager-4ae9c17d9527


## Use Cases

The following use cases were considered during the creation of this specification.


### Stand Alone Package with Reusable Code

The common *owned* pattern is a common example for this use case.i

```javascript
contract owned {
    address owner;

    function owned() {
        owner = msg.sender;
    }

    modifier onlyowner { if (msg.sender != owner) throw; _; }
}
```

> For this example we will assume this file is located in the solidity source file `./contracts/owned.sol`

The `owned` package contains a single solidity source source file which is
intended to be used as a base contract for other contracts to be inherited
from.  The package does not define any pre-deployed addresses for the *owned*
contract.

A Release Lock File for this package would look like this:

```javascript
{
    "lockfile_version": "1",
    "version": "1.0.0",
    "package_name": "owned",
    "license": "MIT",
    "sources": {
        "./contracts/owned.sol": "ipfs://Qme6goiKwGZngCJKJSHmbm5zqb8tB7xxbZq8f7ZeeMcsxw"
    }
}
```



### A sim

1. Code with zero deployed instances.
    1. Reusable base contracts.
2. Code with one or more addresses.
    1. Libraries: Installation of the package involves having an importable interface for the library and linking against the proper address during deployment.
    2. Contracts: Installation of the package involves having an importable interface and some manner of templating in the proper addresses into the local source code prior to compilation as well as other non-contract code that may interact with the installed contract.


It is worth pointing out that the *Library* and *Contract* use cases are functionally the same.  Once [Solidity issue #242](https://github.com/ethereum/solidity/issues/242) has been addressed this distinction may no longer need to exist.

