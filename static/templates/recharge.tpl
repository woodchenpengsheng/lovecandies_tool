{{{each services}}}
    <div style="margin-top: 5px;">
        <ul style="list-style: none;padding: 0;">
            <li>
                <div style="/* border-bottom: 5px solid #efeff4; */display: table;width: 100%;">
                    <div style="display: table-row;">
                        <div style="display: table-cell; vertical-align: middle; width: 30%;">
                            <span style="
                                background-color: #44D7B6;
                                border-radius: 10px;
                                padding: 3px 10px;
                                font-size: 0.65rem;
                            ">服务名称</span>
                        </div>
                        <div style="display: table-cell; vertical-align: middle;">
                            <span>{./serviceName}</span>
                        </div>
                    </div>
                    <div style="display: table-row;">
                        <div style="display: table-cell; vertical-align: middle;">
                            <span style="
                                background-color: #F7B500;
                                border-radius: 10px;
                                padding: 3px 10px;
                                font-size: 0.65rem;
                            ">当前价格</span>
                        </div>
                        <div style="display: table-cell; vertical-align: middle; font-size: 12px; color: #9E9E9E;">
                            <!-- <span style="text-decoration: line-through;">原价:<i>10</i>元</span> -->
                            <span>
                                现价:
                                <i style="color: #ff7f0d; font-weight: bold; font-size: 25px; font-family: Georgia;">{./servicePrice}</i>
                                {{{ if ./rechargePriceCurrency.yuan }}}元{{{end}}}
                                {{{ if ./rechargePriceCurrency.reputation }}}声望{{{end}}}
                            </span>
                        </div>
                    </div>
                    <div style="display: table-row;">
                        <div style="display: table-cell; vertical-align: middle;">
                            <span style="
                                background-color: #32C5FF;
                                border-radius: 10px;
                                padding: 3px 10px;
                                font-size: 0.65rem;
                            ">开通后权限</span>
                        </div>
                        <div style="display: table-cell; vertical-align: middle;">
                            <span>
                                {./serviceDescription}
                            </span>
                        </div>
                    </div>
                </div>
                <div style="padding-bottom: 10px;border-bottom: 5px solid #efeff4;padding-top: 10px;">
                    <button class="btn btn-no-border" component="recharge/pay/button" data-service-id={./serviceId}
                        data-currency-reputation={./rechargePriceCurrency.reputation}
                        data-service-price={./servicePrice}
                        style="
                            width: 100%;
                            color: #FFFFFF !important;
                            border-radius: 15px;
                            padding: 3px 10px;
                            text-align: center;
                            display: inline-block;
                            ">点击开通</button>
                </div>
            </li>
        </ul>
    </div>
{{{ end }}}