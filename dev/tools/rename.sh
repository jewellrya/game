#use to reformat file names "1hAttack-beard1-0001_DR" ---> "1hAttack-beard1-DR-01"
prefix="attack-"

for file in $prefix*.png
do
    part=$(echo "$file" | cut -d'-' -f2)
    number_and_postfix=$(echo "$file" | cut -d'-' -f3 | cut -d'.' -f1)
    number=$(echo "$number_and_postfix" | cut -d'_' -f1)
    postfix=$(echo "$number_and_postfix" | cut -d'_' -f2)

    newfile="$prefix$part-$postfix-$number.png"

    mv "$file" "$newfile"
done