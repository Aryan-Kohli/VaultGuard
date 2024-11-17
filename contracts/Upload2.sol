// SPDX-License-Identifier: Unlicensed
pragma solidity >=0.8.0;

contract Upload2 {
    // this is the structure of any type of file which will be uploaded
    // struct FileData{
    //     string  url;
    //     string name;
    //     string  timeStamp;
    //     string size;
    // }
    //this is the portion for storing previous transactions
    struct TransactionBlock {
        string desc;
        string timeStamp;
    }
    mapping(address => TransactionBlock[]) Transactions;
    // portion for displaying just files desciption excluding file access persons
    struct FileAccess {
        string url;
        string name;
        string timeStamp;
        string size;
        bool access; // agar file delete hogi ya remove to isko false krna hai.kyunki delete nhi kr skte blockchain mein
    }
    mapping(address => mapping(address => FileAccess[])) Ownership;
    //[shared_person][owner]=>[ {FileData,access} ]

    //portion for getting AcessList of each File
    struct sharedAccess {
        address sharedPerson;
        bool access;
    }
    mapping(address => mapping(string => sharedAccess[])) FileAccessList;
    // [owner][file_url][ {sharedPerson Address , bool access},{},{}]

    function getTransactions()
        external
        view
        returns (TransactionBlock[] memory)
    {
        return Transactions[msg.sender];
    }

    function AddFile(
        string memory _url,
        string memory _name,
        string memory _timeStamp,
        string memory _size,
        string memory TransactionString
    ) external {
        FileAccess memory newFileAccess = FileAccess(
            _url,
            _name,
            _timeStamp,
            _size,
            true
        );
        FileAccess[] storage userFiles = Ownership[msg.sender][msg.sender];
        userFiles.push(newFileAccess);

        Transactions[msg.sender].push(
            TransactionBlock(TransactionString, _timeStamp)
        );
    }

    // function getMyFiles() external view returns (FileAccess[] memory) {
    //     return Ownership[msg.sender][msg.sender];
    // }
    function getMyFiles() external view returns (FileAccess[] memory) {
        FileAccess[] memory allFiles = Ownership[msg.sender][msg.sender];
        uint count = 0;

        // First, count how many files have access set to true
        for (uint i = 0; i < allFiles.length; i++) {
            if (allFiles[i].access) {
                count++;
            }
        }

        // Create a temporary array to store files with access = true
        FileAccess[] memory filesWithAccess = new FileAccess[](count);
        uint index = 0;

        // Second, copy files with access = true into the new array
        for (uint i = 0; i < allFiles.length; i++) {
            if (allFiles[i].access) {
                filesWithAccess[index] = allFiles[i];
                index++;
            }
        }

        return filesWithAccess;
    }

    // function sharedFiles(
    //     address _owner
    // ) external view returns (FileAccess[] memory) {
    //     return Ownership[msg.sender][_owner];
    // }
    function sharedFiles(
        address _owner
    )
        external
        view
        returns (
            // string memory TransactionString,
            // string memory _timestamp
            FileAccess[] memory
        )
    {
        FileAccess[] memory allFiles = Ownership[msg.sender][_owner];
        uint count = 0;

        for (uint i = 0; i < allFiles.length; i++) {
            if (allFiles[i].access) {
                count++;
            }
        }

        FileAccess[] memory filesWithAccess = new FileAccess[](count);
        uint index = 0;

        // Second, copy files with access = true into the new array
        for (uint i = 0; i < allFiles.length; i++) {
            if (allFiles[i].access) {
                filesWithAccess[index] = allFiles[i];
                index++;
            }
        }
        // Transactions[_owner].push(
        //     TransactionBlock(TransactionString, _timestamp)
        // );
        return filesWithAccess;
    }
    function SharedTransaction(
        address _owner,
        string memory TransactionString,
        string memory _timestamp
    ) external {
        Transactions[_owner].push(
            TransactionBlock(TransactionString, _timestamp)
        );
    }

    function giveAccess(
        string memory _url,
        string memory _name,
        string memory _timeStamp,
        string memory _size,
        address _sharedPerson,
        string memory TransactionStringowner,
        string memory TransactionStringshared
    ) external {
        FileAccess memory newFileAccess = FileAccess(
            _url,
            _name,
            _timeStamp,
            _size,
            true
        );
        FileAccess[] storage userFiles = Ownership[_sharedPerson][msg.sender];
        userFiles.push(newFileAccess);
        FileAccessList[msg.sender][_url].push(
            sharedAccess(_sharedPerson, true)
        );

        Transactions[msg.sender].push(
            TransactionBlock(TransactionStringowner, _timeStamp)
        );
        Transactions[_sharedPerson].push(
            TransactionBlock(TransactionStringshared, _timeStamp)
        );
    }

    // function getAccesList(
    //     string memory _url
    // ) external view returns (sharedAccess[] memory) {

    //     return FileAccessList[msg.sender][_url];
    // }
    function getAccesList(
        string memory _url
    ) external view returns (sharedAccess[] memory) {
        sharedAccess[] memory allAccess = FileAccessList[msg.sender][_url];
        uint count = 0;

        // First, count how many access entries have access == true
        for (uint i = 0; i < allAccess.length; i++) {
            if (allAccess[i].access) {
                count++;
            }
        }

        // Create a temporary array to store access entries with access = true
        sharedAccess[] memory accessListWithTrue = new sharedAccess[](count);
        uint index = 0;

        // Second, copy the entries with access == true into the new array
        for (uint i = 0; i < allAccess.length; i++) {
            if (allAccess[i].access) {
                accessListWithTrue[index] = allAccess[i];
                index++;
            }
        }

        return accessListWithTrue;
    }

    function removeAccess(
        string memory _url,
        address _sharedPerson,
        string memory TransactionStringowner,
        string memory TransactionStringshared,
        string memory _timeStamp
    ) public {
        uint n = Ownership[_sharedPerson][msg.sender].length; // Corrected the order here
        uint cnt = 0;

        // Iterate over Ownership[_sharedPerson][msg.sender] to find and remove the file
        for (uint i = 0; i < n; i++) {
            if (
                keccak256(
                    abi.encodePacked(
                        Ownership[_sharedPerson][msg.sender][i].url
                    )
                ) == keccak256(abi.encodePacked(_url))
            ) {
                cnt++;
                Ownership[_sharedPerson][msg.sender][i].access = false;
            }
        }

        // Update FileAccessList to mark access as false for the given URL
        uint n2 = FileAccessList[msg.sender][_url].length;
        for (uint i = 0; i < n2; i++) {
            if (
                FileAccessList[msg.sender][_url][i].sharedPerson ==
                _sharedPerson
            ) {
                cnt++;
                FileAccessList[msg.sender][_url][i].access = false;
            }
        }

        if (cnt == 2) {
            Transactions[msg.sender].push(
                TransactionBlock(TransactionStringowner, _timeStamp)
            );
            Transactions[_sharedPerson].push(
                TransactionBlock(TransactionStringshared, _timeStamp)
            );
        } else {
            Transactions[msg.sender].push(
                TransactionBlock("Error in remove access", _timeStamp)
            );
        }
    }

    function deleteFile(
        string memory _url,
        string memory TrasactionStringowner,
        string memory TransactionStringshared,
        string memory _timestamp
    ) external {
        FileAccess[] storage userFiles = Ownership[msg.sender][msg.sender];
        bool fileFound = false;

        for (uint256 i = 0; i < userFiles.length; i++) {
            if (
                keccak256(abi.encodePacked(userFiles[i].url)) ==
                keccak256(abi.encodePacked(_url)) &&
                userFiles[i].access == true
            ) {
                userFiles[i].access = false;
                fileFound = true;
                break;
            }
        }

        require(fileFound, "File not found or already deleted");

        sharedAccess[] storage sharedList = FileAccessList[msg.sender][_url];
        for (uint256 i = 0; i < sharedList.length; i++) {
            if (sharedList[i].access == true) {
                // Find the shared file for the specific person and mark it as false
                FileAccess[] storage sharedPersonFiles = Ownership[
                    sharedList[i].sharedPerson
                ][msg.sender];
                for (uint256 j = 0; j < sharedPersonFiles.length; j++) {
                    if (
                        keccak256(abi.encodePacked(sharedPersonFiles[j].url)) ==
                        keccak256(abi.encodePacked(_url)) &&
                        sharedPersonFiles[j].access == true
                    ) {
                        sharedPersonFiles[j].access = false;
                        break;
                    }
                }

                // Update shared access status to false
                sharedList[i].access = false;
                Transactions[sharedList[i].sharedPerson].push(
                    TransactionBlock(TransactionStringshared, _timestamp)
                );
            }
        }
        Transactions[msg.sender].push(
            TransactionBlock(TrasactionStringowner, _timestamp)
        );
    }
}
