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

The following use cases were considered during the creation of this
specification.  Each use case builds on the previous ones.


### Stand Alone Package with an Inheritable Contract

For the first example we'll look at a package which only contains contracts
which serve as base contracts for other contracts to inherit from but do not
provide any real useful functionality on their own.  The common *owned* pattern
is a example for this use case.

```javascript
pragma solidity ^0.4.0;

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

The smallest Release Lockfile for this package looks like this:

```javascript
{
  "lockfile_version": "1",
  "version": "1.0.0",
  "package_name": "owned",
  "sources": {
    "./contracts/owned.sol": "ipfs://QmUjYUcX9kLv2FQH8nwc3RLLXtU3Yv5XFpvEjFcAKXB6xD"
  }
}
```

A Release Lockfile which includes more than the minimum information would look like this.


```javascript
{
  "lockfile_version": "1",
  "version": "1.0.0",
  "package_name": "owned",
  "package_meta": {
    "license": "MIT",
    "authors": [
      "Piper Merriam <pipermerriam@gmail.com>"
    ],
    "description": "Reusable contracts which implement a priviledged 'owner' model for authorization",
    "keywords": [
      "authorization"
    ],
    "links": {
      "documentation": "ipfs://QmQiqrwqdav5bV8mtv4PqGksGcDWo43f7PAZYwhJqNEv2j"
    }
  },
  "sources": {
    "./contracts/owned.sol": "ipfs://Qme6goiKwGZngCJKJSHmbm5zqb8tB7xxbZq8f7ZeeMcsxw"
  }
}
```

This fully fleshed out Release Lockfile is meant to demonstrate various pieces
of optional data that can be included.  However, for the remainder of our
examples we will be using minimalistic lockfiles to keep our examples as
succinct as possible.


### Package with an Inheritable Contract and a Dependency

Now that we've seen what a simple package looks like, lets see how to
dependencies are declared.

The next package will implement the *transferable* pattern and will depend on
our `owned` package for the authorization mechanism to ensure that only the
contract owner may transfer ownership.  The `transferable` package will
contain a single solidity source file `./contracts/transferable.sol`.

```javascript
pragma solidity ^0.4.0;

import {owned} from "owned/contracts/owned.sol";

contract transferable is owned {
	event OwnerChanged(address indexed prevOwner, address indexed newOwner);

    function transferOwner(address newOwner) public onlyowner returns (bool) {
		OwnerChanged(owner, newOwner);
		owner = newOwner;
		return true;
    }
}
```

The EPM spec is designed to provide as high a guarantee as possible that builds
are deterministic and reproducable.  To ensure that each package you install
gets the *exact* dependencies it needs, all dependencies are declared as
content addressed URIs.  This ensures that when a package manager fetches a
dependency it always gets the right one.

The IPFS URI for the previous `owned` Release Lockfile turns out to be
`ipfs://QmbhPhntTueo8EBq98uc46h3KRhwMKJJqiqKyPv5CxienM` which is what we will
use in our `transferable` package to declare the dependency.  The Release
Lockfile for our package looks like the following.


```javascript
{
  "lockfile_version": "1",
  "version": "1.0.0",
  "package_name": "transferable",
  "sources": {
    "./contracts/transferable.sol": "ipfs://QmZ6Zg1iEejuJ18LFczowe7dyaxXm4KC4xTgnCkqwJZmAp"
  },
  "build_dependencies": {
	"owned": "ipfs://QmbhPhntTueo8EBq98uc46h3KRhwMKJJqiqKyPv5CxienM"
  },
}
```

It will be up to the package management software to determine how the `owned`
dependency actually gets installed as well as handling any import remappings
necessary to make the import statement work.


### Stand Alone Package with a Reusable Contract

In this next example we'll look at a package which contains a reusable
contract.  This means that the package provides a contract which can be on its
own in some manner.  For this example we will be using a *notary* contract.
This contract uses the EVM logging system to keep a record of hashes and the
address which submitted them, allowing the submitter of the hash to prove at
some later time that they had the data represented by the hash. This package
will contain a single solidity source file `./contracts/Notary.sol`.


```javascript
pragma solidity ^0.4.0;

/// @title Notary
/// @author Piper Merriam
contract Notary {
	event HashNotarized(address indexed submitter, bytes32 indexed _hash);

    /// @dev emits the HashNotarized event to log the hash.
    /// @notice The submitted hash will be available in the logs of the transaction receipt.
    /// @param _hash String 32-byte hash of the document being notarized.
    function notarize(bytes32 _hash) public returns (bool) {
		HashNotarized(msg.sender, _hash);
		return true;
    }
}
```

Since this package includes a contract which may be used as-is, our Release
Lockfile is going to contain some additional information that wasn't needed in
the previous examples.  Since we expect people to compile this contract
theirselves we won't need to include any of the contract bytecode, but it will
be useful to include the contract ABI and Natspec information.

```javascript
{
  "lockfile_version": "1",
  "version": "1.0.0",
  "package_name": "notary",
  "sources": {
    "./contracts/notary.sol": "ipfs://QmXtRuSpn1DX3CUk9bbZm8hTKmqXQ5WZB2tMpZYHPS9CUV"
  },
  "contract_types": {
    "notary": {
      "abi": [{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"notarize","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"submitter","type":"address"},{"indexed":true,"name":"_hash","type":"bytes32"}],"name":"HashNotarized","type":"event"}],
      natspec: {
	    "title" : "Notary"
	    "author": "Piper Merriam",
	    "methods": {
	      "notarize(bytes32)": {
            "notice" : "The submitted hash will be available in the logs of the transaction receipt.",
	        "details": "emits the HashNotarized event to log the hash.",
	        "params": {
	          "_hash": "String 32-byte hash of the document being notarized."
	        }
	      }
        }
      }
    }
  }
}
```
