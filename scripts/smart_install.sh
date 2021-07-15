(
    tar -xzf node_modules_backup/node_modules.tar.gz &&
    cmp package.json node_modules_backup/package_json_checksum.json &&
    echo "Installed successfully from backup"
) ||
(
    echo "Could not install from backup. Falling back to manual install..." &&
    npm install &&
    echo "Manual install successful"
)