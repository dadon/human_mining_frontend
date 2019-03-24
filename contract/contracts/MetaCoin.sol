pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract MetaCoin is ERC721Full, Ownable {
	using SafeMath for uint;

	uint8 public maxUnlockedTokenType = 0;
	uint public nextTokenIndex = 1;
	bool public gameFinished = false;
	uint8 public maxTokens = 42;

	mapping(uint => uint8) public tokenTypes;
	mapping(address => uint8) public userLevel;
	mapping(address => string) public userName;
	mapping(uint8 => address) public tokenFirstUnlock;
	mapping(address => uint[]) public userUnlockedTokens;

	mapping(uint8 => string) public tokenTypeImage;
	mapping(uint8 => uint) public tokenTypeHash;

	constructor() ERC721Full("Proof of Human Work artifact", "PHW") public {

	}

	function getTokenTypeImage(uint8 tokenType) public view returns (string memory image) {
		return tokenTypeImage[tokenType];
	}

	function getTokenTypeHash(uint8 tokenType) public view returns (uint hash) {
		return tokenTypeHash[tokenType];
	}

	function getTokenFirstUnlock(uint8 tokenType) public view returns (address user) {
		return tokenFirstUnlock[tokenType];
	}

	function getLevel() public view returns (uint8 level) {
		return userLevel[msg.sender];
	}

	function getUnlockedTokens() public view returns (uint[] memory) {
		return userUnlockedTokens[msg.sender];
	}

	function setTokenType(uint8 tokenType, string memory key, string memory image) public onlyOwner {
		tokenTypeHash[tokenType] = uint(keccak256(bytes(key)));
		tokenTypeImage[tokenType] = image;
	}

	function setMaxTokens(uint8 max) public onlyOwner {
		maxTokens = max;
	}

	function claimToken(uint8 tokenType, string memory key) public {
		assert(!gameFinished);
		uint hash = uint(keccak256(bytes(key)));

		uint8 level = userLevel[msg.sender];
		assert(level == tokenType - 1);

		if (hash != tokenTypeHash[tokenType]) {
			return;
		}

		uint tokenIndex = nextTokenIndex;
		nextTokenIndex = nextTokenIndex.add(1);
		_mint(msg.sender, tokenIndex);
		tokenTypes[tokenIndex] = tokenType;
		userLevel[msg.sender] = tokenType;
		userUnlockedTokens[msg.sender].push(tokenIndex);

		if (tokenFirstUnlock[tokenType] == address(0)) {
			tokenFirstUnlock[tokenType] = msg.sender;
		}

		if (tokenType > maxUnlockedTokenType) {
			maxUnlockedTokenType = tokenType;
		}

		if (tokenType == maxTokens) {
			gameFinished = true;
		}
	}

	function getName(address user) public view returns (string memory name) {
		return userName[user];
	}

	function setName(string memory name) public {
		userName[msg.sender] = name;
	}
}
