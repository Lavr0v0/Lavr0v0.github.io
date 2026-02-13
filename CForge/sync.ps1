$repo = "C:\Users\Yueze(Steven)Wang\Documents\Character Forge"
git -C $repo pull
git -C $repo add -A
git -C $repo commit -m "sync"
git -C $repo push
