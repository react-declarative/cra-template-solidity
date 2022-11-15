<img src="./docs/logo.svg" height="75px" align="right">

# cra-template-solidity

> A Ethereum starter kit for rapid development of the proof of concept solidity app

A starter kit build especially for rapid smart contract development in [Remix IDE](https://remix-project.org/). Once you wrote your Solidity smart contract in Remix you could easely deploy it into global [testnet](https://ethereum.org/en/developers/docs/networks/) or local [Ganache](https://trufflesuite.com/ganache/) blockchain [by using a UI](https://www.linkedin.com/pulse/using-ganache-ethereum-emulator-metamask-farhan-khan/). After that simple copy and paste smart conract address into [params.ts](./template/src/config/params.ts)

![remix-deploy](./docs/remix.png)

## Usage

```bash
npx create-react-app . --template=solidity
```

<img src="./docs/saturn.svg" height="25px" align="right">

## Contains boilerplate for

1. **MetaMask Connection request**

2. **Network ID check**

3. **Contract deployment status check by address**

4. **Sample counter smart contract**

5. **Simple config by variable with smart contract address in source code**

## What's inside

1. [ethers.js](https://docs.ethers.io/v5/)
2. [TypeScript](https://www.typescriptlang.org/)
3. [MUI](https://mui.com/)
4. [Mobx](https://mobx.js.org/)
5. [react-declarative](https://www.npmjs.com/package/react-declarative)
6. [tss-react](https://www.npmjs.com/package/tss-react)

<img src="./docs/cubes.svg" height="25px" align="right">

## Code samples

> Solidity

```sol

// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.7;

contract TodoList {

    struct Todo {
        uint id;
        string content;
        address owner;
        bool isDeleted;
    }

    uint256 public lastTodoId;

    mapping (uint256 => Todo) public todoMap;

    function todosOfOwner() public view returns (uint256[] memory) {
        uint256 todosLength = lastTodoId + 1;
        uint256[] memory ownedTodoDirtyIds = new uint256[](todosLength);
        uint256 ownedTodoIdx = 0;
        for (uint id = 0; id != todosLength; id++) {
            Todo memory todo = todoMap[id];
            if (todo.owner == msg.sender && !todo.isDeleted) {
                ownedTodoDirtyIds[ownedTodoIdx] = todo.id;
                ownedTodoIdx++;
            }
        }
        uint256[] memory ownedTodoIds = new uint256[](ownedTodoIdx);
        for (uint id = 0; id != ownedTodoIdx; id++) {
            ownedTodoIds[id] = ownedTodoDirtyIds[id];
        }
        return ownedTodoIds;
    }

    function addTodo(string memory _content) public {
        uint256 currentId = lastTodoId++;
        Todo memory todo;
        todo.id = currentId;
        todo.content = _content;
        todo.owner = msg.sender;
        todoMap[currentId] = todo;
    }

    function removeTodo(uint256 _id) public {
        Todo storage todo = todoMap[_id];
        require(todo.owner == msg.sender, 'You are not the owner of that todo');
        todo.isDeleted = true;
    }

}

```

> TypeScript

```tsx

// TODO :-)

```

<img src="./docs/triangle.svg" height="25px" align="right">

## See also

This starter kit is build on top of [react-declarative](https://www.npmjs.com/package/react-declarative) npm package. I think you are going to like the way of reactive programming in this app and you will want bring it to other projects which may not require web3 technologies. So check the [github repo](https://github.com/react-declarative/react-declarative) and seek for other guides
