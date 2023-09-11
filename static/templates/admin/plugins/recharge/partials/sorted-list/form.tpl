<form>
    <div class="mb-3">
        <label class="form-label" for="serviceName">服务名</label>
        <input type="text" id="serviceName" name="serviceName" class="form-control" placeholder="服务名" />
    </div>
    <div class="mb-3">
        <label class="form-label" for="serviceId">服务ID</label>
        <input type="text" id="serviceId" name="serviceId" class="form-control" placeholder="服务ID" readonly />
    </div>
    <div class="mb-3">
        <label class="form-label" for="servicePrice">服务价格</label>
        <input type="text" id="servicePrice" name="servicePrice" class="form-control" placeholder="服务价格" />
    </div>
    <div class="mb-3">
        <label class="form-label" for="serviceDescription">服务介绍</label>
        <input type="text" id="serviceDescription" name="serviceDescription" class="form-control" placeholder="服务介绍" />
    </div>
    <div class="mb-3">
        <label class="form-label" for="serviceTypes">服务类型</label>
        <select class="form-select" id="serviceTypes" name="serviceTypes">
            <!-- BEGIN serviceTypes -->
            <option value="{serviceTypes.value}">{serviceTypes.name}</option>
            <!-- END serviceTypes -->
        </select>
    </div>
    <div class="mb-3">
        <label class="form-label" for="serviceParams">其他参数</label>
        <input type="text" id="serviceParams" name="serviceParams" class="form-control" placeholder="其他参数" />
    </div>
</form>