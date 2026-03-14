def main():
    print("Hello from repl-nix-workspace!")


    if __name__ == "__main__":
        import os, uvicorn
        port = int(os.environ.get("PORT", 8080))
        uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True)

    main()
    
