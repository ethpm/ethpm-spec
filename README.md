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
own in some manner.  For this example we will be creating a package which
includes a reusable standard
[ERC20](https://github.com/ethereum/EIPs/issues/20) token contract.

> The source code for these contracts was pulled from the [SingularDTV](https://github.com/ConsenSys/singulardtv-contracts) github repository.  Thanks to them for a very well written contract.

This package will contain two solidity source files.  

* [`./contracts/AbstractToken.sol`](./examples/standard-token/contracts/AbstractToken.sol)
* [`./contracts/StandardToken.sol`](./examples/standard-token/contracts/StandardToken.sol)

Given that these source files are relatively large they will not be included
here within the guide but can be found in the
[`./examples/standard-token/`](./examples/standard-token/) directory within
this repository.

Since this package includes a contract which may be used as-is, our Release
Lockfile is going to contain additional information from our previous examples,
specifically, the `contract_types` section.  Since we expect people to compile
this contract theirselves we won't need to include any of the contract
bytecode, but it will be useful to include the contract ABI and Natspec
information.  Our lockfile will look something like the following.  The
contract ABI and NatSpec sections have been truncated to improve legibility.
The full Release Manifest can be found
[here](./examples/standard-token/1.0.0.json)


```javascript
{
  "lockfile_version": "1",
  "version": "1.0.0",
  "package_name": "standard-token",
  "sources": {
    "./contracts/AbstractToken.sol": "ipfs://QmQMXDprXxCunfQjA42LXZtzL6YMP8XTuGDB6AjHzpYHgk",
    "./contracts/StandardToken.sol": "ipfs://QmPm9p7KeP4MY361dREFshrD5mib5dufjTPyn1LXNf7L2S"
  },
  "contract_types": {
    "StandardToken": {
      "abi": [...],
      "natspec": {
        "author": "Stefan George - <stefan.george@consensys.net>",
        "title": "Standard token contract",
        "methods": {
          "allowance(address,address)": {
            "details": "Returns number of allowed tokens for given address.",
            "params": {
              "_owner": "Address of token owner.",
              "_spender": "Address of token spender."
            }
          },
          ...
        }
      }
    }
  }
}
```

While it is not required to include the contract ABI and NatSpec information,
it does provide those using this package with they data they would need to
interact with an instance of this contract without having to regenerate this
information from source.


### Package which uses a Reusable Contract from a depenency

For our next example we'll be creating a package includes the `standard-token`
contract from our previous example as a dependency and includes a deployed
version of the `StandardToken` contract in the Release Manifest.  This will be
our first package which includes the `deployments` section which is the
location in the Release Lockfile where information about deployed contract
instances is found.

Our package will be called `piper-coin` and will not contain any source files
since it merely makes use of the contracts from the `standard-token` package.
