// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

/// @title Certification Contract Struct
/// @author Agung Adhinata
/// @notice Mengatur struktur data sertifikat dan fungsi-fungsi yang berhubungan dengan sertifikat
struct Certificate {
    string id; // id versi sertifikat saat ini (newer)
    string rootId; // id awal sertifikat (root)
    string prevId; // referensi id 1 versi sebelumnya (newer - 1)
    address signedBy; // alamat pengguna yang menandatangani sertifikat
    string ipfsHash; // IPFS hash dalam menyimpan file sertifkat
    uint256 timestamp; // waktu perubahan / pembuatan
    string title; // judul sertifikat
    string description; // deskripsi sertifikat
}

contract Certification {
    // map sertifikat berdasarkan ID
    mapping(string => Certificate) public certificatesById;

    // map sertifikat terbaru berdasarkan rootId
    mapping(string => string) public latestCertificateIdByRootId;

    // map id sertifikat yang ditandatangani oleh alamat signer (hanya menyimpan root id)
    mapping(address => string[]) public certificateRootIdsBySignedAddress;

    // Event to log certificate creation and updates
    event CertificateSigned(
        string indexed id,
        string indexed rootId,
        string prevId,
        address indexed signedBy,
        string ipfsHash,
        uint256 timestamp
    );

    // buat sertifikat baru. fungsi ini tidak akan bekerja bagi sertifikat yang sudah dibuat sebelumnya
    /// @notice membaut sertifikat menggunakan validasi dan logging
    /// @param _id ID sertifikat
    /// @param _ipfsHash IPFS hash, menyimpan file sertifikat
    /// @param _title judul sertifikat
    /// @param _description deskripsi sertifikat
    function signCertificate(
        string memory _id,
        string memory _ipfsHash,
        string memory _title,
        string memory _description
    ) public {
        require(bytes(_id).length > 0, "Certificate: ID cannot be empty");
        require(
            bytes(_ipfsHash).length > 0,
            "Certificate: IPFS hash cannot be empty"
        );
        require(bytes(_title).length > 0, "Certificate: Title cannot be empty");
        require(
            certificatesById[_id].timestamp == 0,
            "Certificate: ID already exists"
        );
        Certificate memory cert = Certificate({
            id: _id,
            rootId: _id,
            signedBy: msg.sender,
            ipfsHash: _ipfsHash,
            prevId: "",
            timestamp: block.timestamp,
            title: _title,
            description: _description
        });
        // simpan sertifikat
        certificatesById[_id] = cert;

        // update map sertifikat terbaru
        latestCertificateIdByRootId[_id] = _id;
        // update map sertifikat yang ditandatangani oleh alamat signer (root id)
        certificateRootIdsBySignedAddress[msg.sender].push(_id);

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

    // ubah sertifikat yang sudah ada
    function editCertificate(
        string memory _rootId,
        string memory _newId,
        string memory _ipfsHash,
        string memory _title,
        string memory _description
    ) public {
        // Input validation
        require(
            bytes(_newId).length > 0,
            "Certificate: New ID cannot be empty"
        );
        require(
            bytes(_rootId).length > 0,
            "Certificate: Root ID cannot be empty"
        );
        require(
            bytes(_ipfsHash).length > 0,
            "Certificate: IPFS hash cannot be empty"
        );
        require(
            bytes(_title).length > 0,
            "Certificate: Title cannot be empty or null"
        );

        // pastikan sertifikat asli ditemukan sebelum melakukan perubahan
        string memory currentId = latestCertificateIdByRootId[_rootId];
        require(bytes(currentId).length > 0, "Original certificate not found");

        // pastikan hanya owner yang sama yang dapat mengubah sertifikat ini
        Certificate memory currentCert = certificatesById[_rootId];
        require(
            currentCert.signedBy != msg.sender,
            "Only owner can edit existing certificate"
        );

        // pastikan ID baru belum digunakan
        require(
            certificatesById[_newId].timestamp == 0,
            "New certificate ID already exists"
        );

        // Create new version
        Certificate memory newCertificate = Certificate({
            id: _newId,
            rootId: _rootId,
            prevId: currentId,
            signedBy: msg.sender,
            ipfsHash: _ipfsHash,
            timestamp: block.timestamp,
            title: _title,
            description: _description
        });

        // update sertifikat
        certificatesById[_newId] = newCertificate;
        // Update latest certificate
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
        string memory _rootId
    ) public view returns (Certificate memory) {
        string memory latestId = latestCertificateIdByRootId[_rootId];
        require(bytes(latestId).length > 0, "Certificate not found");
        return certificatesById[latestId];
    }

    //mendapat sertifikat berdasarkan id
    function getCertificate(
        string memory _certId
    ) public view returns (Certificate memory) {
        require(bytes(_certId).length > 0, "This field bust not empty");
        return certificatesById[_certId];
    }

    function getCertificates(
        address _signedAddressOwner
    ) public view returns (Certificate[] memory) {
        string[] memory signedCertIds = certificateRootIdsBySignedAddress[
            _signedAddressOwner
        ];
        if (signedCertIds.length == 0) {
            return new Certificate[](0);
        }
        Certificate[] memory latestCertificates = new Certificate[](
            signedCertIds.length
        );

        for (uint256 i = 0; i < signedCertIds.length; i++) {
            string memory latestId = latestCertificateIdByRootId[
                signedCertIds[i]
            ];
            latestCertificates[i] = certificatesById[latestId];
        }
        return latestCertificates;
    }

    // Function to trace the history of a certificate
    function getCertificateHistory(
        string memory _rootId
    ) public view returns (Certificate[] memory) {
        require(
            bytes(latestCertificateIdByRootId[_rootId]).length > 0,
            "Certificate not found"
        );

        // return empty array if no history
        if(bytes(certificatesById[_rootId].prevId).length == 0) {
            return new Certificate[](0);
        }

        // Count the number of versions
        uint256 count = 0;
        string memory currentId = latestCertificateIdByRootId[_rootId];
        while (bytes(currentId).length > 0) {
            count++;
            currentId = certificatesById[currentId].prevId;
        }

        // Retrieve all versions
        Certificate[] memory history = new Certificate[](count);
        currentId = latestCertificateIdByRootId[_rootId];
        for (uint256 i = count; i > 0; i--) {
            history[i - 1] = certificatesById[currentId];
            currentId = certificatesById[currentId].prevId;
        }

        return history;
    }
}
