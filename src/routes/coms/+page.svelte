<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import {
        hapticFeedback,
        getTelegramWebApp,
        getUserId,
    } from "$lib/telegram";
    import { addRecentCustomer } from "$lib/search";
    import { sendComsRequest } from "$lib/api";

    let customer = "";
    let side: "buy" | "sell" = "buy";
    let currency: "USDT" | "USDC" = "USDT";
    let amount = "";
    let rate = "";
    let coms: "0.005" | "0.01" = "0.005";

    let isSubmitting = false;

    onMount(() => {
        customer = $page.url.searchParams.get("customer") || "";

        // Show back button
        const webApp = getTelegramWebApp();
        if (webApp) {
            webApp.BackButton.show();
            webApp.BackButton.onClick(() => {
                goto("/");
            });
        }
    });

    async function handleSubmit() {
        if (!customer || !amount || !rate) {
            hapticFeedback("error");
            return;
        }

        isSubmitting = true;
        hapticFeedback("medium");
        addRecentCustomer(customer);

        const parsedAmount = parseFloat(amount.replace(/,/g, ""));
        const parsedRate = parseFloat(rate.replace(/,/g, ""));

        try {
            // Get user ID from Telegram or use default
            const userId = getUserId() || 1437421739;

            // Send request to API
            const result = await sendComsRequest({
                client: customer,
                side: side,
                currency: currency,
                amount: parsedAmount,
                rate: parsedRate,
                coms: parseFloat(coms),
                user_id: userId,
            });

            hapticFeedback("success");
            alert(`✅ ${result.message}`);

            // Navigate back to home after success
            goto("/");
        } catch (error: any) {
            console.error("[COMS] Error:", error);
            hapticFeedback("error");
            alert(`❌ Error: ${error.message}`);
            isSubmitting = false;
        }
    }

    function formatNumber(value: string): string {
        const num = value.replace(/[^0-9.]/g, "");
        const parts = num.split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

    function handleAmountInput(e: Event) {
        const input = e.target as HTMLInputElement;
        amount = formatNumber(input.value);
    }

    function handleRateInput(e: Event) {
        const input = e.target as HTMLInputElement;
        rate = input.value;
    }
</script>

<div class="container">
    <!-- Header -->
    <div class="header">
        <h1>📝 COMS</h1>
        <div class="customer-badge">{customer}</div>
    </div>

    <!-- Side Selection -->
    <div class="form-group">
        <div class="form-label">Side</div>
        <div class="button-group">
            <button
                class="choice-btn buy-btn"
                class:active={side === "buy"}
                on:click={() => {
                    side = "buy";
                    hapticFeedback("selection");
                }}
            >
                {#if side === "buy"}
                    <span class="check">✓</span>
                {/if}
                <span class="btn-icon">🟢</span>
                <span class="btn-label">BUY</span>
            </button>
            <button
                class="choice-btn sell-btn"
                class:active={side === "sell"}
                on:click={() => {
                    side = "sell";
                    hapticFeedback("selection");
                }}
            >
                {#if side === "sell"}
                    <span class="check">✓</span>
                {/if}
                <span class="btn-icon">🔴</span>
                <span class="btn-label">SELL</span>
            </button>
        </div>
    </div>

    <!-- Currency Selection -->
    <div class="form-group">
        <div class="form-label">Currency</div>
        <div class="button-group">
            <button
                class="choice-btn currency-btn"
                class:active={currency === "USDT"}
                on:click={() => {
                    currency = "USDT";
                    hapticFeedback("selection");
                }}
            >
                {#if currency === "USDT"}
                    <span class="check">✓</span>
                {/if}
                <span class="btn-icon">💵</span>
                <span class="btn-label">USDT</span>
            </button>
            <button
                class="choice-btn currency-btn"
                class:active={currency === "USDC"}
                on:click={() => {
                    currency = "USDC";
                    hapticFeedback("selection");
                }}
            >
                {#if currency === "USDC"}
                    <span class="check">✓</span>
                {/if}
                <span class="btn-icon">💲</span>
                <span class="btn-label">USDC</span>
            </button>
        </div>
    </div>

    <!-- Amount Input -->
    <div class="form-group">
        <div class="form-label">Amount</div>
        <input
            type="text"
            inputmode="decimal"
            placeholder="เช่น 10,000"
            value={amount}
            on:input={handleAmountInput}
            class="input-field"
        />
    </div>

    <!-- Rate Input -->
    <div class="form-group">
        <div class="form-label">Rate</div>
        <input
            type="text"
            inputmode="decimal"
            placeholder="เช่น 32.450"
            value={rate}
            on:input={handleRateInput}
            class="input-field"
        />
    </div>

    <!-- Coms Selection -->
    <div class="form-group">
        <div class="form-label">Commission</div>
        <div class="button-group">
            <button
                class="choice-btn coms-btn"
                class:active={coms === "0.005"}
                on:click={() => {
                    coms = "0.005";
                    hapticFeedback("selection");
                }}
            >
                {#if coms === "0.005"}
                    <span class="check">✓</span>
                {/if}
                <span class="btn-label">0.005</span>
            </button>
            <button
                class="choice-btn coms-btn"
                class:active={coms === "0.01"}
                on:click={() => {
                    coms = "0.01";
                    hapticFeedback("selection");
                }}
            >
                {#if coms === "0.01"}
                    <span class="check">✓</span>
                {/if}
                <span class="btn-label">0.01</span>
            </button>
        </div>
    </div>

    <!-- Summary Preview -->
    {#if amount && rate}
        <div class="preview-card">
            <div class="preview-title">📋 Preview</div>
            <div class="preview-content">
                <span class="preview-customer">{customer}</span>
                <span
                    class="preview-side"
                    class:buy={side === "buy"}
                    class:sell={side === "sell"}
                >
                    {side.toUpperCase()}
                </span>
                <span>{amount} {currency} @ {rate} / {coms}</span>
            </div>
        </div>
    {/if}

    <!-- Submit Button -->
    <div class="submit-section">
        <button
            class="submit-btn"
            on:click={handleSubmit}
            disabled={isSubmitting || !amount || !rate}
        >
            {#if isSubmitting}
                <span class="spinner"></span>
                Sending...
            {:else}
                ✅ Submit
            {/if}
        </button>
    </div>
</div>

<style>
    .container {
        padding: 16px;
        max-width: 480px;
        margin: 0 auto;
    }

    .header {
        text-align: center;
        margin-bottom: 24px;
    }

    .header h1 {
        font-size: 24px;
        margin-bottom: 8px;
        font-weight: 700;
    }

    .customer-badge {
        display: inline-block;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        padding: 8px 20px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 16px;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }

    .form-group {
        margin-bottom: 20px;
    }

    .form-label {
        font-size: 14px;
        font-weight: 600;
        color: #6b7280;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .button-group {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
    }

    .choice-btn {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 16px 12px;
        border-radius: 12px;
        border: 2px solid #e5e7eb;
        background: #f9fafb;
        cursor: pointer;
        transition: all 0.2s ease;
        min-height: 70px;
    }

    .choice-btn:active {
        transform: scale(0.98);
    }

    .choice-btn .check {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 22px;
        height: 22px;
        background: #10b981;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
    }

    .choice-btn .btn-icon {
        font-size: 20px;
        margin-bottom: 4px;
    }

    .choice-btn .btn-label {
        font-size: 16px;
        font-weight: 700;
    }

    /* BUY Button */
    .buy-btn.active {
        background: linear-gradient(135deg, #10b981, #059669);
        border-color: #059669;
        color: white;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
    }

    .buy-btn:not(.active):hover {
        border-color: #10b981;
        background: #ecfdf5;
    }

    /* SELL Button */
    .sell-btn.active {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        border-color: #dc2626;
        color: white;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
    }

    .sell-btn:not(.active):hover {
        border-color: #ef4444;
        background: #fef2f2;
    }

    /* Currency Button */
    .currency-btn.active {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
        border-color: #2563eb;
        color: white;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .currency-btn:not(.active):hover {
        border-color: #3b82f6;
        background: #eff6ff;
    }

    /* Commission Button */
    .coms-btn.active {
        background: linear-gradient(135deg, #f59e0b, #d97706);
        border-color: #d97706;
        color: white;
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
    }

    .coms-btn:not(.active):hover {
        border-color: #f59e0b;
        background: #fffbeb;
    }

    .input-field {
        width: 100%;
        padding: 14px 16px;
        font-size: 16px;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        background: #f9fafb;
        transition: all 0.2s ease;
    }

    .input-field:focus {
        outline: none;
        border-color: #6366f1;
        background: white;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .input-field::placeholder {
        color: #9ca3af;
    }

    .preview-card {
        background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
        border: 2px solid #0ea5e9;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 20px;
    }

    .preview-title {
        font-size: 12px;
        font-weight: 600;
        color: #0369a1;
        text-transform: uppercase;
        margin-bottom: 8px;
    }

    .preview-content {
        font-size: 14px;
        color: #0c4a6e;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
    }

    .preview-customer {
        font-weight: 700;
    }

    .preview-side {
        padding: 2px 8px;
        border-radius: 4px;
        font-weight: 700;
        font-size: 12px;
    }

    .preview-side.buy {
        background: #10b981;
        color: white;
    }

    .preview-side.sell {
        background: #ef4444;
        color: white;
    }

    .submit-section {
        margin-top: 24px;
    }

    .submit-btn {
        width: 100%;
        padding: 16px;
        font-size: 18px;
        font-weight: 700;
        color: white;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        border: none;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    .submit-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
    }

    .submit-btn:active:not(:disabled) {
        transform: scale(0.98);
    }

    .submit-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
    }

    .spinner {
        width: 20px;
        height: 20px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
</style>
