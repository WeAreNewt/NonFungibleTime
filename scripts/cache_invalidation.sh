#!/bin/bash

set -euo pipefail

DOMAIN="${1}"
PATH_INVALIDATE="${2}"

aws cloudfront list-distributions --output=text --query 'DistributionList.Items[*].[Id, DefaultCacheBehavior.TargetOriginId]' | \
while read line ; do
    dist=$(echo $line | awk '{print $1}')
    domain=$(echo $line | awk '{print $2}')

    if [[ ${domain} == ${DOMAIN} ]]; then
        echo "---------------------------------------------------------------------------"
        echo "Invalidating cache for domain ${DOMAIN} on path ${PATH_INVALIDATE}..."
        echo "---------------------------------------------------------------------------"
        invalidation_id=$(aws cloudfront create-invalidation --distribution-id ${dist} --paths "${PATH_INVALIDATE}" --query 'Invalidation.Id' | tr -d '"')
        echo -n "Invalidating"
        until aws cloudfront get-invalidation --id ${invalidation_id} --distribution-id ${dist} --query 'Invalidation.Status' | grep "Completed" | tr -d '"'; do 
            sleep 5;
            echo -n "."
        done
        exit 0;
    fi
done
