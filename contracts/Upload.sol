// SPDX-License-Identifier: Unlicensed
pragma solidity >=0.8.0;

contract Upload {
    struct Access {
        address user;
        bool access;
    }
    struct FileData {
        string url;
        string name;
    }
    mapping(address => FileData[]) value;
    mapping(address => mapping(address => bool)) ownership;
    mapping(address => Access[]) accessList;
    mapping(address => mapping(address => bool)) previousState;
    // previous state will only help us in finding that in past access has been given to a person or not
    // so that we can maintain the size of array i.e. accessList and not make data reduntant
    function add(address user, string memory url, string memory name) external {
        value[user].push(FileData(url, name));
    }

    function allow(address user) external {
        ownership[msg.sender][user] = true;
        if (previousState[msg.sender][user]) {
            uint n = accessList[msg.sender].length;
            for (uint i = 0; i < n; i++) {
                if (accessList[msg.sender][i].user == user) {
                    accessList[msg.sender][i].access = true;
                }
            }
        } else {
            previousState[msg.sender][user] = true;
            accessList[msg.sender].push(Access(user, true));
        }
    }

    function disallow(address user) public {
        ownership[msg.sender][user] = false;
        uint n = accessList[msg.sender].length;
        for (uint i = 0; i < n; i++) {
            if (accessList[msg.sender][i].user == user) {
                accessList[msg.sender][i].access = false;
            }
        }
    }

    function display(address _user) external view returns (FileData[] memory) {
        require(
            _user == msg.sender || ownership[_user][msg.sender],
            "You Don't have access"
        );
        return value[_user];
    }

    function shareAccess() external view returns (Access[] memory) {
        return accessList[msg.sender];
    }
}
