// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Certification {
    address public signatureOwner;

    // track informasi sertifikat
    struct Certificate {
        string rootId; // id awal sertifikat (root)
        string id; // id versi sertifikat saat ini (newer)
        string previousId; // referensi id 1 versi sebelumnya (newer - 1)
        address signedBy; // alamat pengguna yang menandatangani sertifikat
        string ipfsHash; // IPFS hash dalam menyimpan file sertifkat
        uint256 timestamp; // waktu perubahan / pembuatan
        string title; // judul sertifikat
        string description; // deskripsi sertifikat
    }

    // sertifikat berdasarkan ID (root, newer, maupun newer - 1)
    mapping(string => Certificate) public certificates;

    // map yang berfungsi dalam mencatat versi terbaru sertifikat menggunakan id paling awal (init)
    mapping(string => string) public latestCertificateId;

    // menyimpan daftar sertifikat yang sudah dibuat oleh signatureOwner (root ID only)
    mapping(address => string[]) public signedCertificates;

    // Event to log certificate creation and updates
    event CertificateSigned(
        string id,
        string rootId,
        string previousId,
        address signedBy,
        string ipfsHash,
        uint256 timestamp
    );

    // Constructor to set the contract owner
    constructor() {
        signatureOwner = msg.sender;
    }

    // Modifier to restrict access to the contract owner
    modifier onlyOwner() {
        require(msg.sender == signatureOwner, "Not authorized");
        _;
    }

    function getSignatureOwner() public view returns (address) {
        return signatureOwner;
    }

    // buat sertifikat baru. fungsi ini tidak akan bekerja bagi sertifikat yang sudah dibuat sebelumnya
    function signCertificate(
        string memory _id,
        string memory _ipfsHash,
        string memory _title,
        string memory _description
    ) public onlyOwner {
        require(bytes(_id).length > 0, "Certificate ID must not be empty");
        require(bytes(_ipfsHash).length > 0, "IPFS hash must not be empty");
        require(
            certificates[_id].timestamp == 0,
            "Certificate ID already exists"
        );

        // Create and store the certificate
        certificates[_id] = Certificate({
            id: _id,
            rootId: _id,
            signedBy: msg.sender,
            ipfsHash: _ipfsHash,
            previousId: "",
            timestamp: block.timestamp,
            title: _title,
            description: _description
        });

        // Update the latest version tracker
        latestCertificateId[_id] = _id;

        signedCertificates[msg.sender].push(_id);

        // Emit an event for logging
        emit CertificateSigned(
            _id,
            _id,
            "",
            msg.sender,
            _ipfsHash,
            block.timestamp
        );
    }

    // Function to edit a certificate
    function editCertificate(
        string memory _newId,
        string memory _initialId,
        string memory _ipfsHash,
        string memory _title,
        string memory _description
    ) public onlyOwner {
        require(
            bytes(_newId).length > 0,
            "New certificate ID must not be empty"
        );
        require(bytes(_initialId).length > 0, "Original ID must not be empty");
        require(bytes(_ipfsHash).length > 0, "IPFS hash must not be empty");

        // Ensure the original certificate exists
        string memory latestId = latestCertificateId[_initialId];
        require(bytes(latestId).length > 0, "Original certificate not found");

        // Ensure the new ID does not already exist
        require(
            certificates[_newId].timestamp == 0,
            "New certificate ID already exists"
        );

        // Create and store the new version of the certificate
        certificates[_newId] = Certificate({
            id: _newId,
            rootId: _initialId,
            signedBy: msg.sender,
            ipfsHash: _ipfsHash,
            previousId: latestId,
            timestamp: block.timestamp,
            title: _title,
            description: _description
        });

        // Update the latest version tracker
        latestCertificateId[_initialId] = _newId;

        // Emit an event for logging
        emit CertificateSigned(
            _newId,
            _initialId,
            latestId,
            msg.sender,
            _ipfsHash,
            block.timestamp
        );
    }

    // Function to retrieve the latest version of a certificate
    function getLatestCertificate(
        string memory _originalId
    ) public view returns (Certificate memory) {
        string memory latestId = latestCertificateId[_originalId];
        require(bytes(latestId).length > 0, "Certificate not found");
        return certificates[latestId];
    }

    //mendapat sertifikat berdasarkan id
    function getCertificateById(
        string memory _certId
    ) public view returns (Certificate memory){
        require(bytes(_certId).length >0, "This field bust not empty");
        return certificates[_certId];
    }

    function getSignedCertificatesByOwner(
        address _owner
    ) public view returns (Certificate[] memory) {
        string[] memory signedCertIds = signedCertificates[_owner];
        Certificate[] memory latestCertificates = new Certificate[](
            signedCertIds.length
        );

        for (uint256 i = 0; i < signedCertIds.length; i++) {
            string memory latestId = latestCertificateId[signedCertIds[i]];
            latestCertificates[i] = certificates[latestId];
        }
        return latestCertificates;
    }

    // Function to trace the history of a certificate
    function getCertificateHistory(
        string memory _initialId
    ) public view returns (Certificate[] memory) {
        require(
            bytes(latestCertificateId[_initialId]).length > 0,
            "Certificate not found"
        );

        // Count the number of versions
        uint256 count = 0;
        string memory currentId = latestCertificateId[_initialId];
        while (bytes(currentId).length > 0) {
            count++;
            currentId = certificates[currentId].previousId;
        }

        // Retrieve all versions
        Certificate[] memory history = new Certificate[](count);
        currentId = latestCertificateId[_initialId];
        for (uint256 i = count; i > 0; i--) {
            history[i - 1] = certificates[currentId];
            currentId = certificates[currentId].previousId;
        }

        return history;
    }
}
