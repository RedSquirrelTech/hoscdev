pragma solidity >= 0.4.25 < 0.6.0;

contract Greeter {
    string private greeting = "Hello, World!";

    function greet() external view returns(string memory) {
        return greeting;
    }

    function setGreeting(string calldata _greeting) external {
        greeting = _greeting;
    }

}
