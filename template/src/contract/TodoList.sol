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
        emit update();
    }

    function removeTodo(uint256 _id) public {
        Todo storage todo = todoMap[_id];
        require(todo.owner == msg.sender, 'You are not the owner of that todo');
        todo.isDeleted = true;
        emit update();
    }

    event update();

}
