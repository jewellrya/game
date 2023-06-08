# ./rename.sh walking-
prefix="running-"

for file in $prefix*.png
do
    # extract parts of the original filename
    part=$(echo "$file" | cut -d'-' -f2)
    number_and_postfix=$(echo "$file" | cut -d'-' -f3 | cut -d'.' -f1)
    number=$(echo "$number_and_postfix" | cut -d'_' -f1)
    postfix=$(echo "$number_and_postfix" | cut -d'_' -f2)

    # construct the new filename
    newfile="$prefix$part-$postfix-$number.png"

    # rename the file
    mv "$file" "$newfile"
done