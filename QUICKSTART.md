# ⚡ SKAITCH - QUICK START GUIDE

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies
```bash
cd skaitch
npm install
```

### Step 2: Setup Environment
```bash
cp .env.example .env.local
```

Edit `.env.local` and add:
```
REPLICATE_API_KEY=r8_xxx  # Get from replicate.com
```

### Step 3: Run Dev Server
```bash
npm run dev
```

Open http://localhost:3000

---

## 🎨 Test the Canvas

1. Click "Launch App" or go to `/editor`
2. Draw something simple (circle, line)
3. Try different tools from left panel
4. Add a new layer
5. Click "Save"

---

## 🤖 Test AI Assist (When Integrated)

1. Draw a rough circle
2. Click "AI Assist" in right panel
3. Click "Perfect Shape"
4. Or type a custom prompt like "make this a basketball"
5. Accept the result

---

## 📝 Next Steps

Check `HANDOFF.md` for:
- What's completed
- What needs to be built
- Priority tasks
- Code examples

---

## 🐛 Troubleshooting

**Canvas not showing?**
- Check browser console for errors
- Make sure Fabric.js loaded
- Try clearing browser cache

**AI not working?**
- Check if REPLICATE_API_KEY is set
- Verify API key is valid
- Check console for errors

**Build errors?**
- Run `npm install` again
- Delete `.next` folder
- Run `npm run build`

---

## 📦 Project Structure

```
skaitch/
├── app/              # Pages
│   ├── page.tsx     # Landing
│   └── editor/      # Main app
├── components/       # UI components
├── lib/             # Utils & state
├── types/           # TypeScript
└── styles/          # CSS
```

---

## 🎯 Main Files

**Canvas**: `components/canvas/SkaitchCanvas.tsx`
**AI**: `components/ai-assist/AIAssistPanel.tsx`
**State**: `lib/store.ts`
**API**: `app/api/ai/assist/route.ts`

---

## ✅ Checklist

- [ ] npm install works
- [ ] Dev server runs
- [ ] Can draw on canvas
- [ ] Tools change
- [ ] Layers work
- [ ] AI panel shows
- [ ] Can export (TODO)
- [ ] Can mint NFT (TODO)

---

**That's it! Start coding! 🚀**
