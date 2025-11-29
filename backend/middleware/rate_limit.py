import time, secrets
from typing import Dict
from fastapi import Request

# Store usage data: {cookie_id: {"count": int, "reset_time": float}}
usage_tracker: Dict[str, Dict] = {}

# Configuration
FREE_TIER_LIMIT = 1  # Number of free translations
RESET_PERIOD = 24 * 60 * 60  # 24 hours in seconds


def get_or_create_session_id(request: Request) -> str:
    """Get session ID from cookie or create a new one"""
    session_id = request.cookies.get("session_id")
    if not session_id:
        # Generate a simple session ID
        session_id = secrets.token_urlsafe(32)
    print(f"[RATE LIMIT] Session ID: {session_id}")
    print(f"[RATE LIMIT] Current tracker state: {usage_tracker}")
    return session_id


def check_rate_limit(session_id: str) -> tuple[bool, int, int]:
    """
    Check if user has exceeded rate limit
    Returns: (is_allowed, remaining_count, reset_timestamp)
    """
    current_time = time.time()

    # Get or initialize user data
    if session_id not in usage_tracker:
        usage_tracker[session_id] = {
            "count": 0,
            "reset_time": current_time + RESET_PERIOD,
        }
        print(f"[RATE LIMIT] New session created for {session_id}")

    user_data = usage_tracker[session_id]
    print(f"[RATE LIMIT] Current count for {session_id}: {user_data['count']}")

    # Check if reset period has passed
    if current_time >= user_data["reset_time"]:
        print(f"[RATE LIMIT] Resetting count for {session_id}")
        user_data["count"] = 0
        user_data["reset_time"] = current_time + RESET_PERIOD

    # Check if limit exceeded
    remaining = FREE_TIER_LIMIT - user_data["count"]
    is_allowed = user_data["count"] < FREE_TIER_LIMIT

    print(
        f"[RATE LIMIT] CHECK - Count: {user_data['count']}, Limit: {FREE_TIER_LIMIT}, Allowed: {is_allowed}, Remaining: {remaining}"
    )

    return is_allowed, remaining, int(user_data["reset_time"])


def increment_usage(session_id: str):
    """Increment usage count for a session"""
    if session_id in usage_tracker:
        usage_tracker[session_id]["count"] += 1
        print(
            f"[RATE LIMIT] Incremented count for {session_id} to {usage_tracker[session_id]['count']}"
        )

    print(f"[RATE LIMIT] Full tracker after increment: {usage_tracker}")
