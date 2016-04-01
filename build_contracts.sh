#!/bin/bash

CONTRACTS_DIR="./contracts"
BUILD_DIR=${CONTRACTS_DIR}/build
SRC_DIR=${CONTRACTS_DIR}/src

rm -rf ${BUILD_DIR}
mkdir -p ${BUILD_DIR}

solc --bin --abi --interface -o ${BUILD_DIR} ${SRC_DIR}/SimpleStorage.sol