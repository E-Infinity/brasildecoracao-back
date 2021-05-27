#!bin/bash

#Criar diretório caso não exista
DIR="/home/ubuntu/app"
if [ -d "$DIR" ]; then
    echo "${DIR} exists"
else
    echo "Creating ${DIR} directory"
    mkdir ${DIR}
fi