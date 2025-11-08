import logger, os, sys

## instantiate logger
log = logger.get()


## fetches the environment variable, or exits the program if it doesn't exist
def MustGetEnv(var_name: str) -> str:
    value = os.getenv(var_name)
    if value is None:
        log.fatal(f"environment variable {var_name} not found. exiting...")
        sys.exit(1)
    return value
