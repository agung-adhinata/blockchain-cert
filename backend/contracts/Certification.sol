// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract Certification {
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
    mapping(string => Certificate) public certificatesById;

    // map yang berfungsi dalam mencatat versi terbaru sertifikat menggunakan id paling awal (init)
    mapping(string => string) public latestCertificateIdByRootId;

    // menyimpan daftar sertifikat yang sudah dibuat oleh signatureOwner (root ID only)
    mapping(address => string[]) public signedCertificateIdsByAddress;

    // Event to log certificate creation and updates
    event CertificateSigned(
        string id,
        string rootId,
        string previousId,
        address signedBy,
        string ipfsHash,
        uint256 timestamp
    );

    // buat sertifikat baru. fungsi ini tidak akan bekerja bagi sertifikat yang sudah dibuat sebelumnya
    function signCertificate(
        string memory _id,
        string memory _ipfsHash,
        string memory _title,
        string memory _description
    ) public {
        require(bytes(_id).length > 0, "Certificate ID must not be empty");
        require(bytes(_ipfsHash).length > 0, "IPFS hash must not be empty");
        require(
            certificatesById[_id].timestamp == 0,
            "Certificate ID already exists"
        );

        // Create and store the certificate
        certificatesById[_id] = Certificate({
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
        latestCertificateIdByRootId[_id] = _id;

        signedCertificateIdsByAddress[msg.sender].push(_id);

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
        string memory _rootId,
        string memory _newId,
        string memory _ipfsHash,
        string memory _title,
        string memory _description
    ) public {
        require(
            bytes(_newId).length > 0,
            "New certificate ID must not be empty"
        );
        require(bytes(_rootId).length > 0, "Original ID must not be empty");
        require(bytes(_ipfsHash).length > 0, "IPFS hash must not be empty");

        // Ensure the original certificate exists
        string memory currentId = latestCertificateIdByRootId[_rootId];
        require(bytes(currentId).length > 0, "Original certificate not found");
        // ensure that this is the same owner
        Certificate memory cert = certificatesById[_rootId];
        require(cert.signedBy != msg.sender, "owner is not same");

        // Ensure the new ID does not already exist
        require(
            certificatesById[_newId].timestamp == 0,
            "New certificate ID already exists"
        );

        // Create and store the new version of the certificate
        certificatesById[_newId] = Certificate({
            id: _newId,
            rootId: _rootId,
            signedBy: msg.sender,
            ipfsHash: _ipfsHash,
            previousId: currentId,
            timestamp: block.timestamp,
            title: _title,
            description: _description
        });

        // Update the latest version tracker
        latestCertificateIdByRootId[_rootId] = _newId;

        // Emit an event for logging
        emit CertificateSigned(
            _newId,
            _rootId,
            currentId,
            msg.sender,
            _ipfsHash,
            block.timestamp
        );
    }

    // Function to retrieve the latest version of a certificate
    function getLatestCertificate(
        string memory _originalId
    ) public view returns (Certificate memory) {
        string memory latestId = latestCertificateIdByRootId[_originalId];
        require(bytes(latestId).length > 0, "Certificate not found");
        return certificatesById[latestId];
    }

    //mendapat sertifikat berdasarkan id
    function getCertificateById(
        string memory _certId
    ) public view returns (Certificate memory){
        require(bytes(_certId).length >0, "This field bust not empty");
        return certificatesById[_certId];
    }

    function getSignedCertificatesByOwner(
        address _owner
    ) public view returns (Certificate[] memory) {
        string[] memory signedCertIds = signedCertificateIdsByAddress[_owner];
        Certificate[] memory latestCertificates = new Certificate[](
            signedCertIds.length
        );

        for (uint256 i = 0; i < signedCertIds.length; i++) {
            string memory latestId = latestCertificateIdByRootId[signedCertIds[i]];
            latestCertificates[i] = certificatesById[latestId];
        }
        return latestCertificates;
    }

    // Function to trace the history of a certificate
    function getCertificateHistory(
        string memory _initialId
    ) public view returns (Certificate[] memory) {
        require(
            bytes(latestCertificateIdByRootId[_initialId]).length > 0,
            "Certificate not found"
        );

        // Count the number of versions
        uint256 count = 0;
        string memory currentId = latestCertificateIdByRootId[_initialId];
        while (bytes(currentId).length > 0) {
            count++;
            currentId = certificatesById[currentId].previousId;
        }

        // Retrieve all versions
        Certificate[] memory history = new Certificate[](count);
        currentId = latestCertificateIdByRootId[_initialId];
        for (uint256 i = count; i > 0; i--) {
            history[i - 1] = certificatesById[currentId];
            currentId = certificatesById[currentId].previousId;
        }

        return history;
    }
}
