<li data-type="item" class="list-group-item">
    <div class="d-flex gap-2 justify-content-between align-items-start">
        <div class="flex-grow-1">
            <div class="mb-3">
                <label class="form-label" for="serviceName">服务名</label>
                <p class="form-text">{serviceName}</p>
            </div>
            <div class="mb-3">
                <label class="form-label" for="serviceId">服务ID</label>
                <p class="form-text">{serviceId}</p>
            </div>
            <div class="mb-3">
                <label class="form-label" for="servicePrice">服务价格</label>
                <p class="form-text">{servicePrice}</p>
            </div>
            <div class="mb-3">
                <label class="form-label" for="serviceDescription">服务介绍</label>
                <p class="form-text">{serviceDescription}</p>
            </div>
        </div>
        <div class="d-flex gap-1 flex-nowrap">
            <button type="button" data-type="edit" class="btn btn-sm btn-info">Edit</button>
            <button type="button" data-type="remove" class="btn btn-sm btn-danger">Delete</button>
        </div>
    </div>
</li>