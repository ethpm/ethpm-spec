# EVM Smart Contract Packaging Specification

[![Join the chat at https://gitter.im/ethpm/Lobby](https://badges.gitter.im/ethpm/Lobby.svg)](https://gitter.im/ethpm/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Ethereum Packaging Specification


## Specification

* [Release Lock File](./release-lock-file-spec.md)


## Definitions

The following *types* are used within this specification.


### Contract Name

A string matching the regular expression `[_a-zA-Z][_a-zA-Z0-9]*`


### Package Name

A string matching the regular expression `[a-zA-Z][-_a-zA-Z0-9]*`


### IPFS URI

An URI which matches the regular expression `^ipfs:/?/?.*$`

This allows for either one of the following ipfs supported formats:

- `ipfs://Qm...`
- `ipfs:/Qm...`
- `ipfs:Qm...`


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
specification.

1. [`owned`](#stand-alone-package-with-inheritable-contract): A package which contains contracts which are not meant to be used by themselves but rather as base contracts to provide functionality to other contracts through inheritance.
2. [`transferable`](#package-with-inheritable-contract-and-a-dependency): A package which has a single dependency.
3. [`standard-token`](#stand-alone-package-with-reusable-contract): A package which contains a reusable contract.
4. [`safe-math-lib`](#stand-alone-package-with-a-deployed-contract): A package which contains deployed instance of one of the package contracts.
5. [`piper-coin`](#package-which-uses-a-reusable-contract-from-a-dependency): A package which contains a deployed instance of a reusable contract from a dependency.
6. [`escrow`](#stand-alone-package-that-links-against-local-library): A package which contains a deployed instance of a local contract which is linked against a deployed instance of a local library.
7. [`wallet`](#package-with-deployed-instance-which-links-against-a-dependency-library): A package with a deployed instance of a local contract which is linked against a deployed instance of a library from a dependency.


Each use case builds incrementally on the previous one.


### <a id="stand-alone-package-with-inheritable-contract" /> Stand Alone Package with an Inheritable Contract

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
    "./contracts/owned.sol": "ipfs://QmUjYUcX9kLv2FQH8nwc3RLLXtU3Yv5XFpvEjFcAKXB6xD"
  }
}
```

This fully fleshed out Release Lockfile is meant to demonstrate various pieces
of optional data that can be included.  However, for the remainder of our
examples we will be using minimalistic lockfiles to keep our examples as
succinct as possible.


### <a id="package-with-inheritable-contract-and-a-dependency" /> Package with an Inheritable Contract and a Dependency

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
`ipfs://QmXDf2GP67otcF2gjWUxFt4AzFkfwGiuzfexhGuotGTLJH` which is what we will
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
	"owned": "ipfs://QmXDf2GP67otcF2gjWUxFt4AzFkfwGiuzfexhGuotGTLJH"
  }
}
```

It will be up to the package management software to determine how the `owned`
dependency actually gets installed as well as handling any import remappings
necessary to make the import statement work.


### <a id="stand-alone-package-with-reusable-contract" /> Stand Alone Package with a Reusable Contract

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
The full Release Lockfile can be found
[here](./examples/standard-token/1.0.0.json)


```javascript
{
  "lockfile_version": "1",
  "version": "1.0.0",
  "package_name": "standard-token",
  "sources": {
    "./contracts/AbstractToken.sol": "ipfs://QmQMXDprXxCunfQjA42LXZtzL6YMP8XTuGDB6AjHzpYHgk",
    "./contracts/StandardToken.sol": "ipfs://QmNLr7DzmiaQvk25C8bADBnh9bF5V3JfbwHS49kyoGGEHz"
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


### <a id="stand-alone-package-with-a-deployed-contract" /> Stand Alone Package with a Deployed Contract

Now that we've seen what a package looks like which includes a fully functional
contract that is ready to be deployed, lets explore a package that also
includes a deployed instance of that contract.

Solidity Libraries are an
excellend example of this type of package, so for this example we are going to
write a library for *safe* math operations called `safe-math-lib`.  This
library will implement functions to allow addition and subtraction without
needing to check for underflow or overflow conditions.  Our package will have a
single solidity source file `./contracts/SafeMathLib.sol`


```javascript
pragma solidity ^0.4.0;


/// @title Safe Math Library
/// @author Piper Merriam <pipermerriam@gmail.com>
library SafeMathLib {
    /// @dev Subtracts b from a, throwing an error if the operation would cause an underflow.
    /// @param a The number to be subtracted from
    /// @param b The amount that should be subtracted
    function safeAdd(uint a, uint b) returns (uint) {
        if (a + b > a) {
            return a + b;
        } else {
            throw;
        }
    }

    /// @dev Adds a and b, throwing an error if the operation would cause an overflow.
    /// @param a The first number to add
    /// @param b The second number to add
    function safeSub(uint a, uint b) returns (uint) {
        if (b <= a) {
            return a - b;
        } else {
            throw;
        }
    }
}
```

This will be our first package which includes the `deployments` section which is the
location in the Release Lockfile where information about deployed contract
instances is found.  Lets look at the Release Lockfile for this package.  Some
parts have been truncated for readability but the full file can be found
[here](./examples/safe-math-lib/1.0.0.json)

```javascript
{
  "lockfile_version": "1",
  "version": "1.0.0",
  "package_name": "safe-math-lib",
  "sources": {
    "./contracts/SafeMathLib.sol": "ipfs://QmVN1p6MmMLYcSq1VTmaSDLC3xWuAUwEFBFtinfzpmtzQG"
  },
  "contract_types": {
    "SafeMathLib": {
      "bytecode": "0x606060405234610000575b60a9806100176000396000f36504062dabbdf050606060405260e060020a6000350463a293d1e88114602e578063e6cb901314604c575b6000565b603a600435602435606a565b60408051918252519081900360200190f35b603a6004356024356088565b60408051918252519081900360200190f35b6000828211602a57508082036081566081565b6000565b5b92915050565b6000828284011115602a57508181016081566081565b6000565b5b9291505056",
      "runtime_bytecode": "0x6504062dabbdf050606060405260e060020a6000350463a293d1e88114602e578063e6cb901314604c575b6000565b603a600435602435606a565b60408051918252519081900360200190f35b603a6004356024356088565b60408051918252519081900360200190f35b6000828211602a57508082036081566081565b6000565b5b92915050565b6000828284011115602a57508181016081566081565b6000565b5b9291505056",
      "abi": [
        ...
      ],
      "compiler": {
        "type": "solc",
        "version": "0.4.6+commit.2dabbdf0.Darwin.appleclang",
        "settings": {
            "optimize": true
        }
      },
      "natspec": {
        "title": "Safe Math Library",
        "author": "Piper Merriam <pipermerriam@gmail.com>",
        ...
      }
    }
  },
  "deployments": {
    "blockchain://41941023680923e0fe4d74a34bdac8141f2540e3ae90623718e47d66d1ca4a2d/block/1e96de11320c83cca02e8b9caf3e489497e8e432befe5379f2f08599f8aecede": {
      "SafeMathLib": {
        "contract_type": "SafeMathLib",
        "address": "0x8d2c532d7d211816a2807a411f947b211569b68c",
        "transaction": "0xaceef751507a79c2dee6aa0e9d8f759aa24aab081f6dcf6835d792770541cb2b",
        "block": "0x420cb2b2bd634ef42f9082e1ee87a8d4aeeaf506ea5cdeddaa8ff7cbf911810c"
      }
    }
  }
}
```

The first thing to point out is that unlike our `standard-token` contract,
we've included the `bytecode`, `runtime_bytecode` and `compiler` information in
the `SafeMathLib` section of the `contract_type` definition.  This is because
we are also including a deployed instance of this contract and need to require
adequate information for package managers to verify that the contract sound at
the deployed address is in fact from the source code included in this package.

The next thing to look at is the `deployments` section. The first thing you
should see is the
[BIP122](https://github.com/bitcoin/bips/blob/master/bip-0122.mediawiki) URI.

```
blockchain://41941023680923e0fe4d74a34bdac8141f2540e3ae90623718e47d66d1ca4a2d/block/1e96de11320c83cca02e8b9caf3e489497e8e432befe5379f2f08599f8aecede
```

This URI defines the chain on which the `SafeMathLib` library was
deployed.  The first hash you see,
`41941023680923e0fe4d74a34bdac8141f2540e3ae90623718e47d66d1ca4a2d` is the
genesisi block hash for the Ropsten test network.  The later hash
`1e96de11320c83cca02e8b9caf3e489497e8e432befe5379f2f08599f8aecede` is the block
hash for block numbr 168,238 from the Ropsten chain.

Under that URI there is a single *contract instance*.  It specifies that it's
*contract type* is `SafeMathLib`, the address that the *contract instance* can
be found at, the transaction hash for the transaction that deployed the
contract, and the block hash in which the deploying transaction was mined.


### <a id="package-which-uses-a-reusable-contract-from-a-dependency" /> Package which uses a Reusable Contract from a depenency

For our next example we'll be creating a package includes a deployed instance
of a *contract type* from that comes from a package dependency.  This differs
from our previous `safe-math-lib` example where our deployment is referencing a
local contract from the local `contract_types`.  In this package's Release
Lockfile we will be referencing a `contract_type` from one of the
`build_dependencies`

We are going to use the `standard-token` package we created earlier and include
a deployed version of the `StandardToken` contract.

Our package will be called `piper-coin` and will not contain any source files
since it merely makes use of the contracts from the `standard-token` package.
The Release Lockfile is listed below with some sections truncated for improved
readability.  The full Release Lockfile can be found at
[`./examples/piper-coin/1.0.0.json`](./examples/piper-coin/1.0.0.json)


```javascript
{
  "lockfile_version": "1",
  "version": "1.0.0",
  "package_name": "piper-coin",
  "deployments": {
    "blockchain://41941023680923e0fe4d74a34bdac8141f2540e3ae90623718e47d66d1ca4a2d/block/cff59cd4bc7077ae557eb39f84f869a1ea7955d52071bad439f0458383a78780": {
      "PiperCoin": {
        "contract_type": "standard-token:StandardToken",
        "address": "0x11cbb0604e47e0f8501b8f56c1c05f92088dc1b0",
        "transaction": "0x1f8206683e4b1dea1fd2e7299b7606ff27440f33cb994b42b4ecc4b0f83a210f",
        "block": "0xe94a700ef9aa2d7a1b07321838251ea4ade8d4d682121f67899f401433a0d910",
        "bytecode": "...",
        "runtime_bytecode": "...",
        "compiler": {
          "type": "solc",
          "version": "0.4.6+commit.2dabbdf0.Darwin.appleclang"
        }
      }
    }
  },
  "build_dependencies": {
    "standard-token": "ipfs://QmegJYswSDXUJbKWBuTj7AGBY15XceKxnF1o1Vo2VvVPLQ"
  }
}
```

Most of this should be familiar but it's worth pointing out how we reference
*contract types* from dependencies.  Under the `PiperCoin` entry within the
deployments you should see that the `contract_type` key is set to
`standard-token:StandardToken`.  The first portion represents the name of the
package dependency within the `build_dependencies` that should be used.  The
later portion indicates the *contract type* that should be used from that
dependencies *contract types*.


### <a id="stand-alone-package-that-links-against-local-library" /> Stand Alone package with a deployed Library and a contract which Links against that Library

In the previous `safe-math-lib` package we demonstrated what a package with a
deployed instance of one of it's local contracts looks like.  In this example
we will build on that concept with a package which includes a library and a
contract which uses that library as well as deployed instances of both.

The package will be called `escrow` and will implementing a simple escrow
contract.  The escrow contract will make use of a library to safely send ether.
Both the contract and library will be part of the package found in the
following two solidity source files.

* [`./contracts/SafeSendLib.sol`](./examples/escrow/SafeSendLib.sol)
* [`./contracts/Escrow.sol`](./examples/escrow/Escrow.sol)

The full source for these files can be found here:
[`./examples/escrow/`](./examples/escrow/).

The Release Lockfile is listed below with some sections truncated for improved
readability.  The full Release Lockfile can be found at
[`./examples/escrow/1.0.0.json`](./examples/escrow/1.0.0.json)


```javascript
{
  "lockfile_version": "1",
  "version": "1.0.0",
  "package_name": "escrow",
  "sources": {
    "./contracts/SafeSendLib.sol": "ipfs://QmcnzhWjaV71qzKntv4burxyix9W2yBA2LrJB4k99tGqkZ",
    "./contracts/Escrow.sol": "ipfs://QmSwmFLT5B5aag485ZWvHmfdC1cU5EFdcqs1oqE5KsxGMw"
  },
  "contract_types": {
    "SafeSendLib": {
      ...
    },
    "Escrow": {
      ...
    }
  },
  "deployments": {
    "blockchain://41941023680923e0fe4d74a34bdac8141f2540e3ae90623718e47d66d1ca4a2d/block/e76cf1f29a4689f836d941d7ffbad4e4b32035a441a509dc53150c2165f8e90d": {
      "SafeMathLib": {
        "contract_type": "SafeSendLib",
        "address": "0x80d7f7a33e551455a909e1b914c4fd4e6d0074cc",
        "transaction": "0x74561167f360eaa20ea67bd4b4bf99164aabb36b2287061e86137bfa0d35d5fb",
        "block": "0x46554e3cf7b768b1cc1990ad4e2d3a137fe9373c0dda765f4db450cd5fa64102"
      },
      "Escrow": {
        "contract_type": "Escrow",
        "address": "0x35b6b723786fd8bd955b70db794a1f1df56e852f",
        "transaction": "0x905fbbeb6069d8b3c8067d233f58b0196b43da7a20b839f3da41f69c87da2037",
        "block": "0x9b39dcab3d665a51755dedef56e7c858702f5817ce926a0cd8ff3081c5159b7f",
        "link_dependencies": [
          {"offset": 524, "value": "SafeSendLib"},
          {"offset": 824, "value": "SafeSendLib"}
        ]
      }
    }
  }
}
```

This Release Lockfile is the first one we've seen thus far that include the
`link_dependencies` section within one of the *contract instances*.  The
`runtime_bytecode` value for the `Escrow` contract has been excluded from the
example above for readability, but the full value is as follows (wrapped to 80
characters).

```
0x606060405260e060020a600035046366d003ac811461003457806367e404ce1461005d57806369
d8957514610086575b610000565b3461000057610041610095565b60408051600160a060020a0390
92168252519081900360200190f35b34610000576100416100a4565b60408051600160a060020a03
9092168252519081900360200190f35b34610000576100936100b3565b005b600154600160a06002
0a031681565b600054600160a060020a031681565b60005433600160a060020a0390811691161415
61014857600154604080516000602091820152815160e260020a6324d048c7028152600160a06002
0a03938416600482015230909316316024840152905173__SafeSendLib_____________________
______92639341231c926044808301939192829003018186803b156100005760325a03f415610000
57506101e2915050565b60015433600160a060020a039081169116141561002f5760008054604080
51602090810193909352805160e260020a6324d048c7028152600160a060020a0392831660048201
52309092163160248301525173__SafeSendLib___________________________92639341231c92
60448082019391829003018186803b156100005760325a03f41561000057506101e2915050565b61
0000565b5b5b56
```

You can see that the placeholder `__SafeSendLib___________________________` is
present in two locations within this bytecode.  This is referred to as a *link
reference*.  The entries in the `link_dependencies` section of a *contract
instance* describe how these *link references* should be filled in.

The `offset` value specifies the number of characters into the unprefixed
bytecode where the replacement should begin.  The `value` defines what address
should be used to replace the *link reference*.  In this case, the `value` is
referencing the `SafeSendLib` *contract instance* from this release lockfile.


### <a id="package-with-deployed-instance-which-links-against-a-dependency-library" /> Package with a contract with link dependencies on a contract from a package dependency

Now that we've seen how we can handle linking dependencies that rely on
deployed *contract instances* from the local package we'll explore an example
with link dependencies that rely on contracts from the package dependencies.

In this example we'll be writing the `wallet` package which includes a wallet
contract which makes use of the previous `safe-math-lib` package.  We will also
make use of the `owned` package from our very first example to handle
authorization.  Our package will contain a single solidity source file
[`./contracts/Wallet.sol`](./examples/wallet/contracts/Wallet.sol).  The
version below has been trimmed for readability.


```javascript
import {SafeMathLib} from "safe-math-lib/contracts/SafeMathLib.sol";
import {owned} from "owned/contracts/owned.sol";

contract Wallet is owned {
    using SafeMathLib for uint;

    mapping (address => uint) allowances;

    function() {
    }

    function send(address recipient, uint value) public onlyowner {
        recipient.send(value);
    }

    function approve(address recipient, uint value) public onlyowner {
        allowances[recipient] = value;
    }

    function withdraw(uint value) public {
        allowances[msg.sender] = allowances[msg.sender].safeSub(value);
        if (!msg.sender.send(value)) throw;
    }
}
```

The Release Lockfile for our `wallet` package can been seen below.  It has been
trimmed to improve readability.  The full Release Lockfile can be found at
[`./examples/wallet/1.0.0.json`](./examples/wallet/1.0.0.json)


```javascript
{
  "lockfile_version": "1",
  "version": "1.0.0",
  "package_name": "wallet",
  "sources": {
    "./contracts/Wallet.sol": "ipfs://QmYKibsXPSTR5UjywQHX8SM4za1K3QHadtFGWmZqGA4uE9"
  },
  "contract_types": {
    "Wallet": {
      "bytecode": "...",
      "runtime_bytecode": "...",
      ...
    }
  },
  "deployments": {
    "blockchain://41941023680923e0fe4d74a34bdac8141f2540e3ae90623718e47d66d1ca4a2d/block/3ececfa0e03bce2d348279316100913c42ca2dcd51b8bc8d2d87ef2dc6a479ff": {
      "Wallet": {
        "contract_type": "Wallet",
        "address": "0xcd0f8d7dab6c682d3726693ef3c7aaacc6431d1c",
        "transaction": "0x5c113857925ae0d866341513bb0732cd799ebc1c18fcec253bbc41d2a029acd4",
        "block": "0xccd130623ad3b25a357ead2ecfd22d38756b2e6ac09b77a37bd0ecdf16249765",
        "link_dependencies": [
          {"offset": 678, "value": "safe-math-lib:SafeMathLib"}
        ]
      }
    }
  },
  "build_dependencies": {
    "owned": "ipfs://QmXDf2GP67otcF2gjWUxFt4AzFkfwGiuzfexhGuotGTLJH",
    "safe-math-lib": "ipfs://QmfUwis9K2SLwnUh62PDb929JzU5J2aFKd4kS1YErYajdq"
  }
}
```

Just like our previous example, the `runtime_bytecode` has been omitted for
improved readability, but the full value is as follows (wrapped to 80
characters).

```
0x606060405236156100355760e060020a6000350463095ea7b381146100435780632e1a7d4d1461
006a578063d0679d341461008e575b34610000576100415b5b565b005b3461000057610056600435
6024356100b5565b604080519115158252519081900360200190f35b346100005761005660043561
00f8565b604080519115158252519081900360200190f35b34610000576100566004356024356101
da565b604080519115158252519081900360200190f35b6000805433600160a060020a0390811691
16146100d157610000565b50600160a060020a038216600090815260016020819052604090912082
90555b5b92915050565b600160a060020a0333166000908152600160209081526040808320548151
830184905281517fa293d1e800000000000000000000000000000000000000000000000000000000
8152600481019190915260248101859052905173__SafeMathLib___________________________
9263a293d1e89260448082019391829003018186803b156100005760325a03f41561000057505060
4080518051600160a060020a0333166000818152600160205293842091909155925084156108fc02
91859190818181858888f1935050505015156101d157610000565b5060015b919050565b60008054
33600160a060020a039081169116146101f657610000565b604051600160a060020a038416908315
6108fc029084906000818181858888f19450505050505b5b9291505056
```

As you can see, this bytecode contains a *link* reference to the `SafeMathLib`
library from the `safe-math-lib` package dependency.   If you look in the
`link_dependencies` section of our `Wallet` contract you'll see it's items are
similar to the ones from our previous example.


```javascript
"link_dependencies": [
  {"offset": 678, "value": "safe-math-lib:SafeMathLib"}
]
```


However, unlike the previous example which linked against a *local* contract
type,  `value` portion is prefixed with the name of the package which contains
the address of the contract instance that this should be linked against.
