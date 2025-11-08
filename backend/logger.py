import logging, os, sys


## set up simle custom logger
def get() -> logging.Logger:
    log_level = os.getenv("LOG_LEVEL", "INFO")
    logger = logging.getLogger()
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s - %(message)s"))
    logger.addHandler(handler)
    try:
        logger.setLevel(log_level)
    except:
        logger.setLevel("INFO")
    finally:
        return logger
