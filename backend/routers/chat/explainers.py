def explain_rsi(rsi: float) -> str:
    if rsi >= 70:
        return f"{rsi:.1f} (overbought zone)"
    if rsi <= 30:
        return f"{rsi:.1f} (oversold zone)"
    return f"{rsi:.1f} (neutral)"

def explain_ema(ema12: float, ema26: float) -> str:
    if ema12 > ema26:
        return f"EMA12 ({ema12:.2f}) > EMA26 ({ema26:.2f}) → bullish momentum"
    if ema12 < ema26:
        return f"EMA12 ({ema12:.2f}) < EMA26 ({ema26:.2f}) → bearish momentum"
    return f"EMA12 ({ema12:.2f}) ≈ EMA26 ({ema26:.2f}) → sideways"

def explain_bb(price: float, upper: float, lower: float) -> str:
    if price > upper:
        return f"Price ({price:.2f}) above upper band ({upper:.2f}) → strong move / possible overextension"
    if price < lower:
        return f"Price ({price:.2f}) below lower band ({lower:.2f}) → weak move / possible oversold"
    return f"Price ({price:.2f}) inside bands ({lower:.2f} - {upper:.2f}) → normal volatility"
